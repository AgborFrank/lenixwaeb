# Fix APKT008: "No project ID is configured"

## Quick Fix

Your `.env.local` file has the project ID (`1835bba6344939492844b26e40ff0e0b`), but Next.js only reads env vars when the dev server **starts**.

### Steps:

1. **Stop the dev server** (press `Ctrl+C` in the terminal where it's running)

2. **Clear Next.js cache** (optional but recommended):
   ```bash
   rm -rf .next
   ```
   Or on Windows PowerShell:
   ```powershell
   Remove-Item -Recurse -Force .next
   ```

3. **Restart the dev server**:
   ```bash
   npm run dev
   ```

4. **Verify** - The error should be gone. If not, check:
   - `.env.local` is in the **project root** (same folder as `package.json`)
   - File name is exactly `.env.local` (not `.env` or `.env.local.txt`)
   - No extra spaces or quotes around the value
   - Line format: `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=1835bba6344939492844b26e40ff0e0b`

## Why This Happens

Next.js reads `.env.local` **only at startup**. If you:
- Added the file after starting the server
- Edited the file while the server was running
- Changed the variable name

You **must restart** the dev server for changes to take effect.

## Your Current Setup

✅ `.env.local` exists  
✅ Has `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=1835bba6344939492844b26e40ff0e0b`  
✅ Has `NEXT_PUBLIC_PROJECT_ID=1835bba6344939492844b26e40ff0e0b`  

**Just restart the dev server and it should work!**
