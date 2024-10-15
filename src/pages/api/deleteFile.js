import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: import.meta.env.R2_REGION,
  endpoint: import.meta.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: import.meta.env.R2_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.R2_SECRET_ACCESS_KEY,
  },
});

export async function POST({ request }) {
  try {
    const { fileName } = await request.json();

    const deleteCommand = new DeleteObjectCommand({
      Bucket: import.meta.env.R2_BUCKET_NAME,
      Key: fileName,
    });

    await s3Client.send(deleteCommand);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete file' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
