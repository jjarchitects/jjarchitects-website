import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, getAdminCredentials, COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    const credentials = getAdminCredentials();

    // Verify credentials
    const isUsernameValid =
      username &&
      (username.trim().toLowerCase() === credentials.username.toLowerCase() ||
        username.trim().toLowerCase() === "admin@jjarchitects.co.in");

    const isPasswordValid = password && password === credentials.password;

    if (!isUsernameValid || !isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid username or password." },
        { status: 401 }
      );
    }

    // Generate signed session token
    const token = createSessionToken(credentials.username);

    const response = NextResponse.json({
      success: true,
      message: "Authentication successful.",
      user: { username: credentials.username },
    });

    // Set HTTP-only secure session cookie
    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during login." },
      { status: 500 }
    );
  }
}
