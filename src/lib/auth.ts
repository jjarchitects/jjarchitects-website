import { cookies } from "next/headers";
import crypto from "crypto";
import { connectToDatabase } from "@/lib/mongodb";
import UserModel, { IUser } from "@/models/User";

export const COOKIE_NAME = "jj_admin_session";
const SESSION_EXPIRY_DAYS = 7;

export const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@jjarchitects.co.in";

function getSecret() {
  return process.env.AUTH_SECRET || "jj-architects-studio-secret-auth-key-2025";
}

/**
 * Hashes a plain-text password using salt and scryptSync
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

/**
 * Validates a plain-text password against a stored salt:hash string
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    if (!storedHash || !storedHash.includes(":")) return false;
    const [salt, key] = storedHash.split(":");
    if (!salt || !key) return false;
    const hash = crypto.scryptSync(password, salt, 64).toString("hex");
    return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(key, "hex"));
  } catch {
    return false;
  }
}

/**
 * Creates a signed session token: identifier:expiry:signature
 */
export function createSessionToken(identifier: string): string {
  const expiry = Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
  const payload = `${identifier}:${expiry}`;
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
  email?: string;
  username?: string;
} {
  if (!token) return { valid: false };

  try {
    const parts = token.split(":");
    if (parts.length !== 3) return { valid: false };

    const [identifier, expiryStr, signature] = parts;
    const expiry = Number(expiryStr);

    if (isNaN(expiry) || Date.now() > expiry) {
      return { valid: false };
    }

    const payload = `${identifier}:${expiryStr}`;
    const hmac = crypto.createHmac("sha256", getSecret());
    hmac.update(payload);
    const expectedSignature = hmac.digest("hex");

    if (
      crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      )
    ) {
      return { valid: true, email: identifier, username: identifier };
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

/**
 * Ensures the default admin user exists in MongoDB.
 * If not found, automatically creates the admin user document.
 */
export async function ensureAdminUser(): Promise<IUser | null> {
  const conn = await connectToDatabase();
  if (!conn) return null;

  try {
    let admin = await UserModel.findOne({
      email: DEFAULT_ADMIN_EMAIL.toLowerCase(),
    });

    if (!admin) {
      const initialPassword = process.env.ADMIN_PASSWORD || "admin123";
      admin = await UserModel.create({
        email: DEFAULT_ADMIN_EMAIL.toLowerCase(),
        name: "Studio Admin",
        passwordHash: hashPassword(initialPassword),
        role: "admin",
      });
      console.log(`✨ Created default admin user: ${DEFAULT_ADMIN_EMAIL}`);
    }

    return admin;
  } catch (err) {
    console.error("Error in ensureAdminUser:", err);
    return null;
  }
}

/**
 * Authenticates credentials against MongoDB User collection.
 */
export async function authenticateAdminUser(
  email: string,
  passwordPlain: string
): Promise<{ success: boolean; user?: { email: string; name?: string; role: string }; error?: string }> {
  if (!email || !passwordPlain) {
    return { success: false, error: "Please provide both email and password." };
  }

  const conn = await connectToDatabase();
  const cleanEmail = email.trim().toLowerCase();

  if (conn) {
    try {
      // Ensure default user exists if db is empty
      await ensureAdminUser();

      const user = await UserModel.findOne({
        email: cleanEmail,
      });

      if (!user) {
        return { success: false, error: "Invalid email or password." };
      }

      const isValid = verifyPassword(passwordPlain, user.passwordHash);
      if (!isValid) {
        return { success: false, error: "Invalid email or password." };
      }

      return {
        success: true,
        user: {
          email: user.email,
          name: user.name,
          role: user.role,
        },
      };
    } catch (err: any) {
      console.error("Database authentication error:", err);
    }
  }

  // Fallback if MongoDB is temporarily unreachable
  const fallbackPass = process.env.ADMIN_PASSWORD || "admin123";
  const isFallbackMatch =
    cleanEmail === DEFAULT_ADMIN_EMAIL.toLowerCase() &&
    passwordPlain === fallbackPass;

  if (isFallbackMatch) {
    return {
      success: true,
      user: {
        email: DEFAULT_ADMIN_EMAIL,
        name: "Studio Admin (Fallback)",
        role: "admin",
      },
    };
  }

  return { success: false, error: "Invalid email or password." };
}
