import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { MoralisClient } from '../../../../../lib/moralis-client';
import { blacklistAddresses } from '../../../../../lib/token-lists';

// Validate environment variable
const MORALIS_API_KEY = process.env.MORALIS_API_KEY || '';

if (!MORALIS_API_KEY) {
  console.warn('⚠️ MORALIS_API_KEY not set. Token fetching will fail.');
}

// Initialize Moralis client (can be reused across requests)
const moralisClient = MORALIS_API_KEY ? new MoralisClient(MORALIS_API_KEY) : null;

// Fetch tokens using Moralis client
const fetchTokens = async (chainId: number, evmAddress: string) => {
  if (!moralisClient) {
    throw new Error('Moralis API key not configured');
  }
  return moralisClient.fetchTokens(chainId, evmAddress, blacklistAddresses);
};

const positiveIntFromString = (value: string): number => {
  const intValue = parseInt(value, 10);

  if (isNaN(intValue) || intValue <= 0) {
    throw new Error('Value must be a positive integer');
  }

  return intValue;
};

const requestQuerySchema = z.object({
  chainId: z.string().transform(positiveIntFromString),
  evmAddress: z.string(),
});

// Define the API route handler
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ chainId: string; evmAddress: string }> | { chainId: string; evmAddress: string } }
) {
  try {
    // Handle both sync and async params (Next.js 13/14 vs 15+)
    const params = await Promise.resolve(context.params);
    
    if (!params || !params.chainId || !params.evmAddress) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing chainId or evmAddress in route parameters',
        },
        { status: 400 }
      );
    }

    const { chainId, evmAddress } = requestQuerySchema.parse({
      chainId: params.chainId,
      evmAddress: params.evmAddress,
    });

    // Validate that the chain is supported
    const supportedChains = MoralisClient.getSupportedChainIds();
    if (!supportedChains.includes(chainId)) {
      return NextResponse.json(
        {
          success: false,
          error: `Chain ID ${chainId} is not supported. Supported chains: ${supportedChains.join(', ')}`,
        },
        { status: 400 }
      );
    }

    const response = await fetchTokens(chainId, evmAddress);

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    console.error('Error processing the request:', error);

    // Return more detailed error message in development
    const errorMessage =
      error instanceof Error ? error.message : 'Internal Server Error';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
