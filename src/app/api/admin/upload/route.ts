import { NextRequest, NextResponse } from "next/server";
import { uploadBufferToS3, deleteFromS3, isS3Configured } from "@/lib/s3";

export async function POST(req: NextRequest) {
  try {
    if (!isS3Configured()) {
      return NextResponse.json(
        {
          error:
            "AWS S3 is not configured. Please ensure AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_S3_BUCKET_NAME are set in your .env file.",
        },
        { status: 503 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "projects";

    if (!file) {
      return NextResponse.json(
        { error: "No file was uploaded." },
        { status: 400 }
      );
    }

    // Validate mime type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files (JPEG, PNG, WebP, AVIF, SVG) are allowed." },
        { status: 400 }
      );
    }

    // Size limit: 20MB
    const MAX_SIZE = 20 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds the 20MB limit." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await uploadBufferToS3(
      buffer,
      file.name,
      file.type,
      folder
    );

    return NextResponse.json({
      success: true,
      url: uploadResult.url,
      key: uploadResult.key,
      filename: file.name,
      size: file.size,
    });
  } catch (error: any) {
    console.error("S3 Upload error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload file to S3." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (!isS3Configured()) {
      return NextResponse.json(
        {
          error:
            "AWS S3 is not configured. Please ensure AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_S3_BUCKET_NAME are set in your .env file.",
        },
        { status: 503 }
      );
    }

    let urlOrKey: string | null = null;

    // Check query parameters first
    const { searchParams } = new URL(req.url);
    urlOrKey = searchParams.get("url") || searchParams.get("key");

    // If not in query, parse JSON body
    if (!urlOrKey) {
      try {
        const body = await req.json();
        urlOrKey = body?.url || body?.key;
      } catch {}
    }

    if (!urlOrKey) {
      return NextResponse.json(
        { error: "Image URL or S3 key is required for deletion." },
        { status: 400 }
      );
    }

    const result = await deleteFromS3(urlOrKey);

    return NextResponse.json({
      success: true,
      message: result.skipped
        ? "File is not stored on S3, skipped S3 deletion."
        : `Successfully deleted image from S3 (${result.key}).`,
      key: result.key,
      skipped: Boolean(result.skipped),
    });
  } catch (error: any) {
    console.error("S3 Delete error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete file from S3." },
      { status: 500 }
    );
  }
}
