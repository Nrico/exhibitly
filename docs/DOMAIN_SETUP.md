# Connecting a Custom Domain

Exhibitly allows you to connect a custom domain (e.g., `www.yourname.com`) to your portfolio.

## Overview

Since Exhibitly is hosted on Vercel, you can point your domain to our servers using DNS records.

## Step 1: Purchase a Domain
If you haven't already, purchase a domain from a registrar like GoDaddy, Namecheap, or Google Domains.

## Step 2: Configure DNS Records

Log in to your domain registrar's dashboard and find the **DNS Settings** or **DNS Management** section.

### For a Root Domain (e.g., `yourname.com`)
Add an **A Record**:
- **Type**: A
- **Name/Host**: `@` (or leave blank)
- **Value**: `76.76.21.21` (Vercel's IP)
- **TTL**: Automatic or 3600

### For a Subdomain (e.g., `www.yourname.com` or `portfolio.yourname.com`)
Add a **CNAME Record**:
- **Type**: CNAME
- **Name/Host**: `www` (or `portfolio`)
- **Value**: `cname.vercel-dns.com`
- **TTL**: Automatic or 3600

## Step 3: Verify Connection

Once you've added the records, it may take up to 48 hours for changes to propagate (though it's usually much faster).

## Troubleshooting

- **"Not Secure" Warning**: SSL certificates are automatically provisioned. If you see this error immediately after setup, wait 15-30 minutes for the certificate to generate.
- **Redirect Loop**: Ensure you haven't configured "Forwarding" in your registrar settings. You must use DNS records (A or CNAME), not URL Forwarding.
