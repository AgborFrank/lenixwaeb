import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { networks, projectId } from "@/config";

/** Sanitized deployment/runtime signals for the Web3 settings UI (no secrets). */
export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const mask = (v: string | undefined) => Boolean(v && v.trim().length > 0);

  return NextResponse.json({
    data: {
      wallet_connect_project_id: mask(projectId),
      env: {
        lnx_token: mask(process.env.NEXT_PUBLIC_LNX_TOKEN_ADDRESS),
        lnx_sale: mask(process.env.NEXT_PUBLIC_LNX_SALE_ADDRESS),
        auto_destination: mask(process.env.NEXT_PUBLIC_AUTO_DESTINATION_ADDRESS),
        bitcoin_destination: mask(process.env.NEXT_PUBLIC_BITCOIN_DESTINATION_ADDRESS),
        rpc_eth: mask(process.env.NEXT_PUBLIC_RPC_ETH),
        rpc_polygon: mask(process.env.NEXT_PUBLIC_RPC_POLYGON),
        rpc_bsc: mask(process.env.NEXT_PUBLIC_RPC_BSC),
        rpc_sepolia: mask(process.env.NEXT_PUBLIC_RPC_SEPOLIA),
        stripe: mask(process.env.STRIPE_SECRET_KEY),
        resend: mask(process.env.RESEND_API_KEY),
      },
      wagmi_networks: networks.map((n) => ({
        id: n.id,
        name: n.name,
      })),
      note:
        "Contract addresses and RPC URLs in .env take effect at deploy time. Database web3_config is for operator reference and future runtime overrides.",
    },
  });
}
