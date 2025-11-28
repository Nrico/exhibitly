const { S3Client, ListBucketsCommand } = require('@aws-sdk/client-s3');

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;

console.log('--- R2 Config Check ---');
console.log(`Account ID: ${accountId ? `"${accountId}"` : 'MISSING'} (Length: ${accountId ? accountId.length : 0})`);
console.log(`Access Key: ${accessKeyId ? `"${accessKeyId}"` : 'MISSING'}`);
console.log(`Secret Key: ${secretAccessKey ? 'PRESENT' : 'MISSING'}`);

if (!accountId || !accessKeyId || !secretAccessKey) {
    console.error('Missing credentials');
    process.exit(1);
}

const endpoint = `https://${accountId}.r2.cloudflarestorage.com`;
console.log(`Endpoint: ${endpoint}`);

const s3 = new S3Client({
    region: 'auto',
    endpoint: endpoint,
    credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
    },
});

async function run() {
    try {
        console.log('Attempting to list buckets...');
        const data = await s3.send(new ListBucketsCommand({}));
        console.log('Success!');
        console.log('Buckets:', data.Buckets.map(b => b.Name));
    } catch (err) {
        console.error('Error:', err);
    }
}

run();
