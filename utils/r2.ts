import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

const R2_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID
const R2_ACCESS_KEY_ID = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID
const R2_SECRET_ACCESS_KEY = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY
const R2_BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME
const R2_PUBLIC_DOMAIN = process.env.NEXT_PUBLIC_R2_DOMAIN || `https://pub-${R2_ACCOUNT_ID}.r2.dev` // Fallback to dev URL if not set

let s3Client: S3Client | null = null;

function getS3Client() {
    if (s3Client) return s3Client;

    if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
        throw new Error('Missing R2 credentials');
    }

    const accountId = R2_ACCOUNT_ID!.trim();
    const accessKeyId = R2_ACCESS_KEY_ID!.trim();
    const secretAccessKey = R2_SECRET_ACCESS_KEY!.trim();

    const endpoint = `https://${accountId}.r2.cloudflarestorage.com`;
    console.log('Initializing R2 Client with endpoint:', endpoint);

    s3Client = new S3Client({
        region: 'auto',
        endpoint,
        credentials: {
            accessKeyId,
            secretAccessKey,
        },
    });

    return s3Client;
}

export async function uploadToR2(file: File, path: string, contentType: string) {
    if (!R2_BUCKET_NAME) {
        throw new Error('Server configuration error: Missing R2_BUCKET_NAME');
    }

    const S3 = getS3Client();

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    try {
        await S3.send(new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: path,
            Body: buffer,
            ContentType: contentType,
        }))

        // Return the public URL
        return `${R2_PUBLIC_DOMAIN}/${path}`
    } catch (error) {
        console.error('R2 Upload Error:', error)
        throw new Error(`Failed to upload file to R2: ${(error as Error).message}`)
    }
}

export async function deleteFromR2(path: string) {
    try {
        const S3 = getS3Client();
        // Extract key from full URL if passed
        const key = path.replace(`${R2_PUBLIC_DOMAIN}/`, '')

        await S3.send(new DeleteObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: key,
        }))
    } catch (error) {
        console.error('R2 Delete Error:', error)
        // Don't throw, just log
    }
}
