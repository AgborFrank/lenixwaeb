import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecret = process.env.STRIPE_SECRET_KEY;

if (!stripeSecret) {
	throw new Error("Missing STRIPE_SECRET_KEY env variable");
}

const stripe = new Stripe(stripeSecret, { apiVersion: "2024-06-20" });

/**
 * Env required:
 * - STRIPE_SECRET_KEY
 */
export async function POST(req: NextRequest) {
	try {
		const { usdAmount, walletAddress } = await req.json();
		if (!usdAmount || !walletAddress) {
			return NextResponse.json({ error: "usdAmount and walletAddress required" }, { status: 400 });
		}
		const amountCents = Math.round(Number(usdAmount) * 100);
		if (!Number.isFinite(amountCents) || amountCents <= 0) {
			return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
		}

		const fallbackPriceUsd = Number(process.env.LNX_PRICE_USD || "0.095");

		const intent = await stripe.paymentIntents.create({
			amount: amountCents,
			currency: "usd",
			automatic_payment_methods: { enabled: true },
			metadata: {
				walletAddress: String(walletAddress),
				usdAmount: String(usdAmount),
				priceUsd: String(fallbackPriceUsd),
			},
		});

		return NextResponse.json({ clientSecret: intent.client_secret });
	} catch (e: any) {
		return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
	}
} 