import { NextResponse } from "next/server";
import { getMarketTickerData } from "@/lib/market-ticker";

export async function GET() {
  try {
    const data = await getMarketTickerData();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("[MarketsTicker] Failed to fetch ticker data", error);
    return NextResponse.json(
      {
        error: "Failed to load market data",
      },
      { status: 500 },
    );
  }
}
