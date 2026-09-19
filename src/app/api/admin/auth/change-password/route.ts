import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import UserModel from "@/models/User";
import {
  verifySessionToken,
  COOKIE_NAME,
  verifyPassword,
  hashPassword,
  DEFAULT_ADMIN_EMAIL,
  createSessionToken,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    const session = verifySessionToken(token);

    if (!session.valid || (!session.email && !session.username)) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in to change your password." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { currentPassword, newPassword, confirmPassword } = body;

    if (!newPassword || typeof newPassword !== "string") {
      return NextResponse.json(
        { error: "New password is required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "New password and confirmation password do not match." },
        { status: 400 }
      );
    }

    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json(
        { error: "Database connection failed. Please ensure MongoDB is running." },
        { status: 503 }
      );
    }

    // Find the current admin user
    const identifier = (session.email || session.username || "").toLowerCase();
    let user = await UserModel.findOne({
      $or: [
        { email: identifier },
        { email: DEFAULT_ADMIN_EMAIL.toLowerCase() },
      ],
    });

    if (!user) {
      return NextResponse.json(
        { error: "User account not found in database." },
        { status: 404 }
      );
    }

    // If current password was provided, verify it
    if (currentPassword) {
      const isCurrentValid = verifyPassword(currentPassword, user.passwordHash);
      if (!isCurrentValid) {
        return NextResponse.json(
          { error: "Current password is incorrect." },
          { status: 400 }
        );
      }
    }

    // Update password
    user.passwordHash = hashPassword(newPassword);
    await user.save();

    // Re-issue fresh session token with user email
    const newToken = createSessionToken(user.email);

    const response = NextResponse.json({
      success: true,
      message: "Password changed successfully.",
      user: {
        email: user.email,
        name: user.name,
      },
    });

    response.cookies.set({
      name: COOKIE_NAME,
      value: newToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error: any) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred while updating password." },
      { status: 500 }
    );
  }
}
