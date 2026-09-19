import { NextRequest, NextResponse } from "next/server";
import { authenticateAdminUser, createSessionToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = body.email || body.username;
    const { password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Please provide both email and password." },
        { status: 400 }
      );
    }

    const authResult = await authenticateAdminUser(email, password);

    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { error: authResult.error || "Invalid credentials." },
        { status: 401 }
      );
    }

    // Generate signed session token using user email
    const token = createSessionToken(authResult.user.email);

    const response = NextResponse.json({
      success: true,
      message: "Authentication successful.",
      user: authResult.user,
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
