import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { ethers } from "ethers";
import { ERC20_ABI } from "@/lib/abis/ERC20";

export const runtime = "nodejs";

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const rpcUrl = process.env.RPC_URL;
const treasuryKey = process.env.SELLER_PRIVATE_KEY;
const tokenAddress = (process.env.LNX_TOKEN_ADDRESS || process.env.NEXT_PUBLIC_LNX_TOKEN_ADDRESS) as `0x${string}` | undefined;

if (!stripeSecret) {
	throw new Error("Missing STRIPE_SECRET_KEY env variable");
}
if (!webhookSecret) {
	throw new Error("Missing STRIPE_WEBHOOK_SECRET env variable");
}

const stripe = new Stripe(stripeSecret, { apiVersion: "2024-06-20" });

async function transferTokensToBuyer({ walletAddress, usdAmount, priceUsd }: { walletAddress: string; usdAmount: number; priceUsd: number; }) {
	if (!rpcUrl || !treasuryKey || !tokenAddress) {
		throw new Error("RPC_URL, SELLER_PRIVATE_KEY, and LNX_TOKEN_ADDRESS are required for delivery");
	}

	const provider = new ethers.JsonRpcProvider(rpcUrl);
	const wallet = new ethers.Wallet(treasuryKey, provider);
	const token = new ethers.Contract(tokenAddress, ERC20_ABI as any, wallet);
	const decimals: number = Number(await token.decimals());

	// Compute tokens with integer math: amountMicros / priceMicros * 10^decimals
	const amountMicros = BigInt(Math.round(usdAmount * 1_000_000));
	const priceMicros = BigInt(Math.round(priceUsd * 1_000_000));
	if (priceMicros === BigInt(0)) throw new Error("Invalid token price");
	let scale = BigInt(1);
	for (let i = 0; i < decimals; i++) scale = scale * BigInt(10);
	const tokensUnits = (amountMicros * scale) / priceMicros;
	if (tokensUnits <= BigInt(0)) throw new Error("Calculated zero tokens for given amount");

	const tx = await token.transfer(walletAddress, tokensUnits);
	const receipt = await tx.wait();
	return { txHash: tx.hash, tokensUnits: tokensUnits.toString(), blockNumber: receipt?.blockNumber };
}

export async function POST(req: NextRequest) {
	const sig = req.headers.get("stripe-signature");
	if (!sig) {
		return NextResponse.json({ error: "Missing signature" }, { status: 400 });
	}
	const payload = await req.text();

	let event: Stripe.Event;
	try {
		event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
	} catch (err: any) {
		return NextResponse.json({ error: `Webhook signature verification failed: ${err.message}` }, { status: 400 });
	}

	if (event.type === "payment_intent.succeeded") {
		const pi = event.data.object as Stripe.PaymentIntent;
		const delivered = (pi.metadata && pi.metadata.delivered === "true") || false;
		const walletAddress = pi.metadata?.walletAddress as string | undefined;
		const metaUsd = pi.metadata?.usdAmount ? Number(pi.metadata.usdAmount) : undefined;
		const metaPrice = pi.metadata?.priceUsd ? Number(pi.metadata.priceUsd) : undefined;
		const amountUsd = metaUsd ?? (pi.amount_received ? pi.amount_received / 100 : undefined);
		const priceUsd = metaPrice ?? Number(process.env.LNX_PRICE_USD || "0.095");

		if (delivered) {
			return NextResponse.json({ received: true, alreadyDelivered: true });
		}
		if (!walletAddress || !amountUsd || amountUsd <= 0) {
			return NextResponse.json({ error: "Missing walletAddress or amount" }, { status: 400 });
		}

		try {
			const delivery = await transferTokensToBuyer({ walletAddress, usdAmount: amountUsd, priceUsd });
			// Mark as delivered to ensure idempotency
			await stripe.paymentIntents.update(pi.id, {
				metadata: {
					...(pi.metadata || {}),
					delivered: "true",
					txHash: delivery.txHash,
					tokensUnits: delivery.tokensUnits,
				}
			});
			return NextResponse.json({ received: true, txHash: delivery.txHash });
		} catch (e: any) {
			return NextResponse.json({ error: e?.message || "Delivery failed" }, { status: 500 });
		}
	}

	return NextResponse.json({ received: true });
} 