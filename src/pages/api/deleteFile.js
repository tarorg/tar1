import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

export async function post({ request }) {
  const { fileName } = await request.json();

  const s3 = new S3Client({
    region: "auto",
    endpoint: `https://${import.meta.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: import.meta.env.R2_ACCESS_KEY_ID,
      secretAccessKey: import.meta.env.R2_SECRET_ACCESS_KEY,
    },
  });

  const command = new DeleteObjectCommand({
    Bucket: import.meta.env.R2_BUCKET_NAME,
    Key: fileName,
  });

  try {
    await s3.send(command);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error deleting file from R2:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
