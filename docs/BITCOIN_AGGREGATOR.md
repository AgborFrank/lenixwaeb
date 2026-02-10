# Bitcoin Aggregator

## Overview

The Bitcoin Aggregator component enables users to connect Bitcoin wallets and transfer BTC to a destination address. It works alongside the EVM TokenAggregator to provide comprehensive multi-chain token aggregation support.

## Features

- **Multi-Wallet Support**: Supports Unisat, OKX, and Xverse Bitcoin wallets
- **Balance Fetching**: Fetches Bitcoin balance from Blockstream API
- **Bitcoin Transfers**: Sends BTC to destination addresses with automatic fee calculation
- **Address Validation**: Validates Bitcoin addresses (Legacy, P2SH, Bech32, Bech32m, Testnet)
- **Fee Estimation**: Automatically calculates and deducts network fees

## Supported Wallets

### Unisat Wallet
- **Installation**: [Unisat Wallet](https://unisat.io/)
- **API**: Uses `window.unisat` global object
- **Methods**: `requestAccounts()`, `sendBitcoin()`, `getFeeRate()`

### OKX Wallet
- **Installation**: [OKX Wallet](https://www.okx.com/web3)
- **API**: Uses `window.okxwallet.bitcoin` global object
- **Methods**: `connect()`, `sendBitcoin()`, `getFeeRate()`

### Xverse Wallet
- **Installation**: [Xverse Wallet](https://www.xverse.app/)
- **Status**: Integration coming soon
- **Note**: Currently shows placeholder message

## Configuration

### Environment Variables

Add to `.env.local`:

```bash
# Optional: Bitcoin destination address
NEXT_PUBLIC_BITCOIN_DESTINATION_ADDRESS=bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
```

### Component Usage

The BitcoinAggregator component is automatically included in the main page (`src/app/page.tsx`):

```tsx
import { BitcoinAggregator } from "@/components/BitcoinAggregator";

// In your page component:
<BitcoinAggregator />
```

## How It Works

### 1. Wallet Detection

The component automatically detects available Bitcoin wallet extensions:

```typescript
// Checks for:
- window.unisat (Unisat wallet)
- window.okxwallet (OKX wallet)
- window.XverseProviders (Xverse wallet)
```

### 2. Wallet Connection

Users click "Connect" to connect their Bitcoin wallet:

- **Unisat**: Calls `unisat.requestAccounts()` to get addresses
- **OKX**: Calls `okxwallet.bitcoin.connect()` to connect
- **Xverse**: Placeholder for future implementation

### 3. Balance Fetching

After connection, the component fetches Bitcoin balance from Blockstream API:

```typescript
GET https://blockstream.info/api/address/{address}
```

Returns:
- Confirmed balance
- Unconfirmed balance
- Total balance (in satoshis)

### 4. Bitcoin Transfer

When transferring Bitcoin:

1. **Validates** destination address format
2. **Estimates** network fees (defaults to 10k sats if fee rate unavailable)
3. **Calculates** transfer amount: `balance - estimatedFee`
4. **Sends** transaction via wallet API
5. **Refreshes** balance after 3 seconds

### 5. Address Validation

Supports multiple Bitcoin address formats:

- **Legacy (P2PKH)**: Starts with `1` (e.g., `1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa`)
- **P2SH**: Starts with `3` (e.g., `3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy`)
- **Bech32**: Starts with `bc1` (mainnet) or `tb1` (testnet)
- **Bech32m**: Starts with `bc1p` (mainnet) or `tb1p` (testnet)

## API Reference

### Component Props

The BitcoinAggregator component accepts no props. It uses:

- `destinationAddressAtom` from Jotai (for EVM address display)
- `BITCOIN_DESTINATION_ADDRESS` from config (for default BTC address)

### Functions

#### `fetchBalance(address: string): Promise<BitcoinBalance | null>`
Fetches Bitcoin balance from Blockstream API.

#### `connectUnisat(): Promise<void>`
Connects to Unisat wallet.

#### `connectOKX(): Promise<void>`
Connects to OKX wallet.

#### `transferBitcoin(): Promise<void>`
Transfers Bitcoin to destination address.

#### `refreshBalance(): Promise<void>`
Refreshes the current wallet balance.

#### `disconnect(): void`
Disconnects the current wallet.

## Limitations

### Current Limitations

1. **Xverse Support**: Xverse wallet integration is not yet implemented (placeholder)
2. **Fee Estimation**: Uses default 10k sats if wallet doesn't provide fee rate
3. **Transaction Size**: Assumes ~250 bytes for fee calculation (may vary)
4. **Network**: Currently uses mainnet Blockstream API (testnet support can be added)

### Non-ERC-20 Tokens

**Important**: This component handles **Bitcoin (BTC) only**. For non-ERC-20 tokens on EVM chains:

- **ERC-721 (NFTs)**: Not supported by TokenAggregator
- **ERC-1155 (Multi-token)**: Not supported by TokenAggregator
- **Custom Tokens**: May work if they implement ERC-20 interface

For non-EVM chains (Solana, Cosmos, etc.), separate aggregators would need to be created.

## Security Considerations

1. **Address Validation**: Always validates Bitcoin address format before sending
2. **Fee Calculation**: Ensures sufficient balance to cover network fees
3. **Balance Refresh**: Automatically refreshes balance after transfers
4. **Error Handling**: Comprehensive error handling for wallet API failures

## Troubleshooting

### "No Bitcoin wallets detected"

**Solution**: Install a Bitcoin wallet extension:
- [Unisat Wallet](https://unisat.io/)
- [OKX Wallet](https://www.okx.com/web3)
- [Xverse Wallet](https://www.xverse.app/)

### "Failed to fetch balance"

**Possible Causes**:
- Network connectivity issues
- Blockstream API rate limiting
- Invalid address format

**Solution**: Check network connection and try refreshing balance.

### "Insufficient balance to cover network fees"

**Solution**: Ensure you have enough BTC to cover both the transfer amount and network fees (typically 10k-50k sats).

### "Invalid Bitcoin address format"

**Solution**: Ensure the destination address is a valid Bitcoin address:
- Legacy: Starts with `1` or `3`
- Bech32: Starts with `bc1` (mainnet) or `tb1` (testnet)
- Bech32m: Starts with `bc1p` (mainnet) or `tb1p` (testnet)

## Future Enhancements

1. **Xverse Integration**: Full Xverse wallet support
2. **Testnet Support**: Support for Bitcoin testnet addresses
3. **Custom Fee Rates**: Allow users to set custom fee rates
4. **Transaction History**: Display recent Bitcoin transactions
5. **Multi-Signature Support**: Support for multi-sig Bitcoin wallets
6. **Lightning Network**: Integration with Lightning Network for instant transfers

## Related Components

- **TokenAggregator**: Handles EVM tokens (ERC-20) across multiple chains
- **GetTokens**: Fetches EVM token balances
- **SendTokens**: Sends EVM tokens manually

## See Also

- [TokenAggregator Documentation](./TOKEN_AGGREGATOR.md)
- [Environment Setup](./ENV_SETUP.md)
- [Technical Documentation](./TECHNICAL_DOCUMENTATION.md)
