import { NextResponse } from "next/server";
import { connectToDatabase, isMongoConnected } from "@/lib/mongodb";
import { getS3ConfigStatus } from "@/lib/s3";

export async function GET() {
  let mongoConnected = false;
  let mongoError: string | null = null;
  const mongoConfigured = Boolean(process.env.MONGODB_URI);

  if (mongoConfigured) {
    try {
      const conn = await connectToDatabase();
      mongoConnected = Boolean(conn && isMongoConnected());
    } catch (err: any) {
      mongoError = err.message || "Failed to connect to MongoDB";
    }
  }

  const s3Status = getS3ConfigStatus();

  return NextResponse.json({
    mongo: {
      configured: mongoConfigured,
      connected: mongoConnected,
      error: mongoError,
    },
    s3: s3Status,
    timestamp: new Date().toISOString(),
  });
}
