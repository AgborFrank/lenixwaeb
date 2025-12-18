# Bitnovatus

A Next.js application that integrates with Reown appkit to enable crypto wallet connectivity and cross-border payment functionality.

## Features

### Token Sweeper

The Token Sweeper component allows users to efficiently manage and transfer their ERC20 tokens across multiple chains using EIP-2612 permits for gasless approvals.

#### Native MATIC Handling

When only native MATIC is detected on Polygon, the Token Sweeper provides three options:

1. **Wrap to WMATIC**: Convert native MATIC to WMATIC (Wrapped MATIC) using the official WMATIC contract
2. **Swap to USDC**: Exchange native MATIC for USDC using 1inch DEX aggregator
3. **Swap to USDT**: Exchange native MATIC for USDT using 1inch DEX aggregator

#### Supported Tokens

- **Polygon**: WMATIC, USDC, USDT
- **Ethereum Mainnet**: USDC, USDT
- **BSC**: USDC, USDT

#### Key Features

- **Multi-chain support**: Works across Polygon, Ethereum Mainnet, and BSC
- **Gasless approvals**: Uses EIP-2612 permits to avoid approval transactions
- **Native token wrapping**: Automatic MATIC to WMATIC conversion
- **DEX integration**: 1inch API integration for token swaps
- **Real-time balance tracking**: Monitors token balances across all supported chains
- **User-friendly UI**: Clear visual indicators and action buttons

#### Usage

1. Connect your wallet
2. Enter target wallet address
3. If native MATIC is detected, choose to wrap or swap
4. For ERC20 tokens, use the "Sweep Tokens" button to transfer all tokens to the target address

#### Environment Variables

```env
NEXT_PUBLIC_ONE_INCH_API_KEY=your_1inch_api_key
NEXT_PUBLIC_PROJECT_ID=your_walletconnect_project_id
```

## Technology Stack

- **Framework**: Next.js 15.4.6 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI primitives with custom shadcn/ui components
- **Web3**: Reown appkit, Wagmi, Viem, Ethers.js
- **State Management**: TanStack React Query
- **Wallet Connectivity**: WalletConnect, various wallet connectors

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Smart Contracts

The TokenSweeper smart contract is deployed on multiple chains and supports:

- EIP-2612 permit-based token transfers
- Native token forwarding
- Multi-token batch transfers
- Owner-controlled emergency withdrawals

## Security

- All user inputs are validated
- Private keys are never stored in code
- HTTPS is required in production
- Proper error boundaries and error handling
- Secure Web3 interactions using established libraries
