import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from 'crypto';

export async function GET({ request }) {
    console.log('GetSignedUrl endpoint hit');
    try {
        const url = new URL(request.url);
        const fileName = url.searchParams.get('fileName');
        const fileType = url.searchParams.get('fileType');

        console.log('Received request for:', { fileName, fileType });

        if (!fileName || !fileType) {
            console.log('Missing fileName or fileType');
            return new Response(JSON.stringify({ error: 'fileName and fileType are required' }), { 
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Generate a random filename
        const randomString = crypto.randomBytes(16).toString('hex');
        const fileExtension = fileName.split('.').pop();
        const randomFileName = `${randomString}.${fileExtension}`;

        console.log('Environment variables:', {
            R2_ACCOUNT_ID: import.meta.env.R2_ACCOUNT_ID,
            R2_BUCKET_NAME: import.meta.env.R2_BUCKET_NAME,
            R2_ACCESS_KEY_ID: import.meta.env.R2_ACCESS_KEY_ID ? 'Set' : 'Not set',
            R2_SECRET_ACCESS_KEY: import.meta.env.R2_SECRET_ACCESS_KEY ? 'Set' : 'Not set',
        });

        const s3Client = new S3Client({
            region: "auto",
            endpoint: `https://${import.meta.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId: import.meta.env.R2_ACCESS_KEY_ID,
                secretAccessKey: import.meta.env.R2_SECRET_ACCESS_KEY,
            }
        });

        const command = new PutObjectCommand({
            Bucket: import.meta.env.R2_BUCKET_NAME,
            Key: randomFileName,
            ContentType: fileType
        });

        console.log('Generating signed URL for:', randomFileName);
        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        console.log('Signed URL generated:', signedUrl);

        return new Response(JSON.stringify({ signedUrl, fileName: randomFileName }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error generating signed URL:', error);
        return new Response(JSON.stringify({ 
            error: 'Failed to generate signed URL',
            details: error.message,
            stack: error.stack
        }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
