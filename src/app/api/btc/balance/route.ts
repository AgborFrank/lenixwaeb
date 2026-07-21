import { NextResponse } from "next/server";

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const ALCHEMY_BASE_URL = "https://bitcoin-mainnet.g.alchemy.com/v2";

interface AlchemyAddressResponse {
  address: string;
  balance: string;
  totalReceived: string;
  totalSent: string;
  unconfirmedBalance: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");

  if (!address || address.length < 14 || address.length > 90) {
    return NextResponse.json({ error: "Invalid address" }, { status: 400 });
  }

  if (!ALCHEMY_API_KEY) {
    return NextResponse.json({ error: "Bitcoin provider not configured" }, { status: 500 });
  }

  try {
    const response = await fetch(
      `${ALCHEMY_BASE_URL}/${ALCHEMY_API_KEY}/api/v2/address/${encodeURIComponent(address)}`,
      {
        headers: { Accept: "application/json" },
        next: { revalidate: 15 },
      },
    );

    if (!response.ok) {
      throw new Error(`Provider returned ${response.status}`);
    }

    const data = (await response.json()) as AlchemyAddressResponse;

    const confirmed = Number(data.balance) || 0;
    const unconfirmed = Number(data.unconfirmedBalance) || 0;

    return NextResponse.json({
      confirmed,
      unconfirmed,
      total: confirmed + unconfirmed,
    });
  } catch (error) {
    console.error("BTC balance fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch balance" }, { status: 500 });
  }
}
