# Environment setup (fix APKT008 / "No project ID")

## Fix "No project ID is configured" (APKT008)

1. **Create `.env.local`** in the **project root** (same folder as `package.json`).

2. **Use the same variable name as the drain project:**
   ```bash
   NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_actual_project_id_here
   ```

3. **Get your Project ID**
   - [Reown Dashboard](https://dashboard.reown.com) or [WalletConnect Cloud](https://cloud.walletconnect.com)
   - Create/sign in to a project and copy the **Project ID**.

4. **Restart the dev server** after creating or editing `.env.local`:
   ```bash
   # Stop the server (Ctrl+C), then:
   npm run dev
   ```

5. **Check**
   - File name must be exactly `.env.local` (not `.env` only).
   - No quotes around the value: `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=abc123` not `"abc123"`.
   - No spaces around `=`.

Optional (auto transfer destination):

```bash
NEXT_PUBLIC_AUTO_DESTINATION_ADDRESS=0xYourDestinationAddress
```

See `env.example` in the project root for a template.
