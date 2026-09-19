const COOKIE_NAME = "jj_admin_session";
const SECRET = process.env.AUTH_SECRET || "jj-architects-studio-secret-auth-key-2025";

/**
 * Validates session token using Web Crypto API (supported in Edge and Node runtimes)
 */
export async function verifyTokenWebCrypto(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;

  try {
    const parts = token.split(":");
    if (parts.length !== 3) return false;

    const [username, expiryStr, signature] = parts;
    const expiry = Number(expiryStr);

    if (isNaN(expiry) || Date.now() > expiry) {
      return false;
    }

    const payload = `${username}:${expiryStr}`;
    const encoder = new TextEncoder();
    const keyData = encoder.encode(SECRET);
    const messageData = encoder.encode(payload);

    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign", "verify"]
    );

    // Convert hex signature to Uint8Array
    const sigBytes = new Uint8Array(
      signature.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []
    );

    const isValid = await crypto.subtle.verify(
      "HMAC",
      cryptoKey,
      sigBytes,
      messageData
    );

    return isValid;
  } catch (e) {
    return false;
  }
}

export { COOKIE_NAME };
