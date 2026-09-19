import { cookies } from "next/headers";
import crypto from "crypto";

export const COOKIE_NAME = "jj_admin_session";
const SESSION_EXPIRY_DAYS = 7;

// Default credentials if not set in .env
export function getAdminCredentials() {
  return {
    username: process.env.ADMIN_USERNAME || "admin",
    password: process.env.ADMIN_PASSWORD || "admin123",
  };
}

function getSecret() {
  return process.env.AUTH_SECRET || "jj-architects-studio-secret-auth-key-2025";
}

/**
 * Creates a signed session token: username:expiry:signature
 */
export function createSessionToken(username: string): string {
  const expiry = Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
  const payload = `${username}:${expiry}`;
  const hmac = crypto.createHmac("sha256", getSecret());
  hmac.update(payload);
  const signature = hmac.digest("hex");
  return `${payload}:${signature}`;
}

/**
 * Verifies a session token string
 */
export function verifySessionToken(token: string | undefined | null): {
  valid: boolean;
  username?: string;
} {
  if (!token) return { valid: false };

  try {
    const parts = token.split(":");
    if (parts.length !== 3) return { valid: false };

    const [username, expiryStr, signature] = parts;
    const expiry = Number(expiryStr);

    if (isNaN(expiry) || Date.now() > expiry) {
      return { valid: false };
    }

    const payload = `${username}:${expiryStr}`;
    const hmac = crypto.createHmac("sha256", getSecret());
    hmac.update(payload);
    const expectedSignature = hmac.digest("hex");

    if (
      crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      )
    ) {
      return { valid: true, username };
    }
  } catch (e) {
    return { valid: false };
  }

  return { valid: false };
}

/**
 * Server-side helper to check if current request has a valid admin session
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    const result = verifySessionToken(token);
    return result.valid;
  } catch {
    return false;
  }
}
