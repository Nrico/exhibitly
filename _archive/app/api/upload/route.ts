import { r2 } from '@/lib/r2';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fileName = searchParams.get('fileName');
  const fileType = searchParams.get('fileType');

  if (!fileName || !fileType) {
    return NextResponse.json({ error: 'fileName and fileType are required' }, { status: 400 });
  }

  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
    Key: fileName,
    ContentType: fileType,
  });

  try {
    const presignedUrl = await getSignedUrl(r2, putObjectCommand, {
      expiresIn: 3600, // URL expires in 1 hour
    });
    return NextResponse.json({ url: presignedUrl });
  } catch (error: any) {
    console.error('Error generating presigned URL:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
