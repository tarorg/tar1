import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export async function POST({ request }) {
    console.log('Upload endpoint hit');
    try {
        const formData = await request.formData();
        console.log('FormData received');
        const file = formData.get('file');

        if (!file) {
            console.log('No file uploaded');
            return new Response(JSON.stringify({ error: 'No file uploaded' }), { 
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        console.log('File received:', file.name, 'Type:', file.type);

        // Log environment variables (be careful not to log sensitive information in production)
        console.log('R2_ACCOUNT_ID:', import.meta.env.R2_ACCOUNT_ID);
        console.log('R2_BUCKET_NAME:', import.meta.env.R2_BUCKET_NAME);
        console.log('PUBLIC_R2_CUSTOM_DOMAIN:', import.meta.env.PUBLIC_R2_CUSTOM_DOMAIN);

        const s3Client = new S3Client({
            region: "auto",
            endpoint: `https://${import.meta.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId: import.meta.env.R2_ACCESS_KEY_ID,
                secretAccessKey: import.meta.env.R2_SECRET_ACCESS_KEY,
            }
        });

        console.log('S3 client created');

        const fileBuffer = await file.arrayBuffer();
        const fileName = `${Date.now()}-${file.name}`;

        console.log('Preparing to upload file:', fileName);

        const putObjectCommand = new PutObjectCommand({
            Bucket: import.meta.env.R2_BUCKET_NAME,
            Key: fileName,
            Body: fileBuffer,
            ContentType: file.type
        });

        console.log('Sending file to R2');
        await s3Client.send(putObjectCommand);
        console.log('File sent to R2');

        const publicUrl = `https://${import.meta.env.PUBLIC_R2_CUSTOM_DOMAIN}/${fileName}`;

        console.log('File uploaded successfully:', publicUrl);

        return new Response(JSON.stringify({ url: publicUrl }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error in upload handler:', error);
        console.error('Error stack:', error.stack);
        return new Response(JSON.stringify({ 
            error: 'Upload failed', 
            details: error.message, 
            stack: error.stack,
            env: {
                R2_ACCOUNT_ID: import.meta.env.R2_ACCOUNT_ID,
                R2_BUCKET_NAME: import.meta.env.R2_BUCKET_NAME,
                PUBLIC_R2_CUSTOM_DOMAIN: import.meta.env.PUBLIC_R2_CUSTOM_DOMAIN
            }
        }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
