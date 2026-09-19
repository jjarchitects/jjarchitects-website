import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";

const region = process.env.AWS_REGION || "ap-south-1";
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const bucketName = process.env.AWS_S3_BUCKET_NAME;

export function isS3Configured(): boolean {
  return Boolean(region && accessKeyId && secretAccessKey && bucketName);
}

export function getS3ConfigStatus() {
  return {
    configured: isS3Configured(),
    region: region || "Not configured",
    bucket: bucketName || "Not configured",
    hasAccessKey: Boolean(accessKeyId),
    hasSecretKey: Boolean(secretAccessKey),
  };
}

let s3ClientInstance: S3Client | null = null;

function getS3Client(): S3Client {
  if (!s3ClientInstance) {
    if (!accessKeyId || !secretAccessKey) {
      throw new Error("AWS credentials (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY) are not set.");
    }

    s3ClientInstance = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }
  return s3ClientInstance;
}

export interface UploadResult {
  url: string;
  key: string;
  bucket: string;
}

export async function uploadBufferToS3(
  buffer: Buffer,
  filename: string,
  contentType: string,
  folder = "projects"
): Promise<UploadResult> {
  if (!isS3Configured()) {
    throw new Error(
      "AWS S3 is not configured. Please set AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_S3_BUCKET_NAME in your .env file."
    );
  }

  // Clean filename and create unique key
  const sanitizedFilename = filename.toLowerCase().replace(/[^a-z0-9.-]/g, "-");
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const key = `${folder}/${timestamp}-${randomSuffix}-${sanitizedFilename}`;

  const client = getS3Client();

  const command = new PutObjectCommand({
    Bucket: bucketName!,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });

  await client.send(command);

  const customBaseUrl = process.env.NEXT_PUBLIC_S3_BASE_URL?.replace(/\/$/, "");
  const url = customBaseUrl
    ? `${customBaseUrl}/${key}`
    : `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;

  return {
    url,
    key,
    bucket: bucketName!,
  };
}

/**
 * Extracts S3 object key from an S3 URL or relative key string.
 * Returns null if the URL does not point to the configured S3 bucket.
 */
export function extractS3Key(urlOrKey: string): string | null {
  if (!urlOrKey || typeof urlOrKey !== "string") return null;
  const trimmed = urlOrKey.trim();
  if (!trimmed) return null;

  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    return trimmed.replace(/^\/+/, "");
  }

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.toLowerCase();

    const isAwsHost = host.includes(".amazonaws.com");
    const isBucketHost = Boolean(bucketName && host.includes(bucketName.toLowerCase()));

    if (!isAwsHost && !isBucketHost) {
      return null;
    }

    let pathname = decodeURIComponent(parsed.pathname).replace(/^\/+/, "");

    // If path-style URL: bucket-name/key...
    if (bucketName && pathname.toLowerCase().startsWith(bucketName.toLowerCase() + "/")) {
      pathname = pathname.substring(bucketName.length + 1);
    }

    return pathname || null;
  } catch {
    return null;
  }
}

/**
 * Deletes a single file from S3 by URL or Key.
 * Gracefully ignores non-S3 URLs (like Cloudinary).
 */
export async function deleteFromS3(
  urlOrKey: string
): Promise<{ success: boolean; key: string | null; skipped?: boolean }> {
  if (!isS3Configured()) {
    throw new Error("AWS S3 is not configured.");
  }

  const key = extractS3Key(urlOrKey);
  if (!key) {
    return { success: true, key: null, skipped: true };
  }

  const client = getS3Client();
  const command = new DeleteObjectCommand({
    Bucket: bucketName!,
    Key: key,
  });

  await client.send(command);
  return { success: true, key };
}

/**
 * Deletes multiple files from S3 given an array of URLs or Keys.
 */
export async function deleteMultipleFromS3(
  urlsOrKeys: string[]
): Promise<{ deleted: string[]; skipped: string[] }> {
  if (!isS3Configured()) {
    throw new Error("AWS S3 is not configured.");
  }

  const keysToDelete: string[] = [];
  const skipped: string[] = [];

  for (const item of urlsOrKeys) {
    const key = extractS3Key(item);
    if (key) {
      keysToDelete.push(key);
    } else {
      skipped.push(item);
    }
  }

  if (keysToDelete.length === 0) {
    return { deleted: [], skipped };
  }

  const client = getS3Client();
  const batchSize = 1000;
  const deleted: string[] = [];

  for (let i = 0; i < keysToDelete.length; i += batchSize) {
    const batch = keysToDelete.slice(i, i + batchSize);
    const command = new DeleteObjectsCommand({
      Bucket: bucketName!,
      Delete: {
        Objects: batch.map((k) => ({ Key: k })),
        Quiet: false,
      },
    });

    const response = await client.send(command);
    if (response.Deleted) {
      for (const d of response.Deleted) {
        if (d.Key) deleted.push(d.Key);
      }
    }
  }

  return { deleted, skipped };
}
