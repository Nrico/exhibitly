const { S3Client, ListBucketsCommand } = require('@aws-sdk/client-s3');

// Manually load env vars for testing since we are running this with node directly
// We will pass them in via command line or just rely on them being set in the shell if possible,
// but for this test I'll try to read them from process.env if the user runs it with `source .env && node ...`
// Or simpler: I'll ask the script to print what it sees (masked).

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;

console.log('--- R2 Connection Test ---');
console.log('Account ID present:', !!accountId);
if (accountId) console.log('Account ID length:', accountId.length);
if (accountId) console.log('Account ID preview:', accountId.substring(0, 4) + '...');

console.log('Access Key ID present:', !!accessKeyId);
console.log('Secret Access Key present:', !!secretAccessKey);

if (!accountId || !accessKeyId || !secretAccessKey) {
    console.error('ERROR: Missing credentials.');
    process.exit(1);
}

const endpoint = `https://${accountId.trim()}.r2.cloudflarestorage.com`;
console.log('Endpoint:', endpoint);

const s3 = new S3Client({
    region: 'auto',
    endpoint: endpoint,
    credentials: {
        accessKeyId: accessKeyId.trim(),
        secretAccessKey: secretAccessKey.trim(),
    },
});

async function run() {
    try {
        console.log('Attempting to list buckets...');
        const data = await s3.send(new ListBucketsCommand({}));
        console.log('Success! Buckets:', data.Buckets?.map(b => b.Name).join(', '));
    } catch (err) {
        console.error('Connection failed:', err);
        if (err.name === 'NetworkingError' || err.code === 'EPROTO') {
            console.log('\nPOSSIBLE CAUSE: Invalid Account ID or Endpoint.');
            console.log('Please verify CLOUDFLARE_ACCOUNT_ID is correct.');
        }
    }
}

run();
