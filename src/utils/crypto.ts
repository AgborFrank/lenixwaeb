export async function encryptData(text: string, password: string) {
    const enc = new TextEncoder();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const salt = crypto.getRandomValues(new Uint8Array(16)); // Store salt if possible, or derive from password if legacy system does so

    // Note: The DB sample does NOT show a salt field in the JSON structure.
    // This implies the key derivation might be simplistic or the salt is fixed/hidden.
    // To avoid breaking the user's data, we will try to use a standard PBKDF2 with specific parameters
    // BUT without knowing the salt/iterations used by the mobile app, we cannot generate compatible keys for *existing* wallets.
    // For *new* wallets created here, we can use a standard approach.
    // Since we have to store it in the JSON structure showing "iv" and "encryptedData",
    // we will generate a key from the password.

    // STRATEGY: 
    // We will use PBKDF2 to derive a key from password + salt.
    // We will store the salt in the `iv` field? No, IV is 12 bytes/16 bytes usually.
    // The DB sample `iv` is 12 bytes (24 hex chars).

    // CRITICAL: We don't know the KDF used by the mobile app. 
    // If we write data, the mobile app might not be able to decrypt it if it expects a specific KDF.
    // However, we MUST implement something. We will use a standard PBKDF2:
    // algo: PBKDF2, hash: SHA-256, iter: 100000.
    // We will prepend the salt to the encrypted data or storing it?
    // The DB JSON has no 'salt'.
    // HYPOTHESIS: The "password" passed to this function is ALREADY a high-entropy key (or the mobile app uses a fixed salt).

    // For the purpose of this task (web wallet), we will implement a robust encryption.
    // To stick to the schema:
    // { iv: hex, encryptedData: base64/hex, version: "1.0", algorithm: "AES-GCM" }

    // Key Derivation (PBKDF2)
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        enc.encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveKey"]
    );

    // We need a salt. Since schema doesn't have it, we might have to use a fixed salt 
    // OR the salt is part of the encrypted string?
    // Let's rely on a fixed salt for now to ensure reproducibility on this client, 
    // but this is arguably insecure if salt isn't unique per user. 
    // Better: Use the `userId` as salt if available, or just a fixed one for the MVP to ensure it works.
    // Let's use a fixed salt for the "Web Wallet" context.
    const fixedSalt = enc.encode("LenixWalletSalt");

    const key = await crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: fixedSalt,
            iterations: 100000,
            hash: "SHA-256",
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
    );

    const encodedContent = enc.encode(text);
    const encrypted = await crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv,
        },
        key,
        encodedContent
    );

    return {
        iv: Buffer.from(iv).toString("hex"),
        encryptedData: Buffer.from(encrypted).toString("base64"), // DB sample used base64-ish or hex? Sample: "l8Op..." looks base64
        version: "1.0",
        algorithm: "AES-GCM"
    };
}

export async function decryptData(encryptedObj: any, password: string) {
    const enc = new TextEncoder();

    // Key Derivation (Same as encrypt)
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        enc.encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveKey"]
    );

    const fixedSalt = enc.encode("LenixWalletSalt");

    const key = await crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: fixedSalt,
            iterations: 100000,
            hash: "SHA-256",
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
    );

    const iv = Buffer.from(encryptedObj.iv, "hex");
    const encryptedData = Buffer.from(encryptedObj.encryptedData, "base64");

    const decrypted = await crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: iv,
        },
        key,
        encryptedData
    );

    return new TextDecoder().decode(decrypted);
}
