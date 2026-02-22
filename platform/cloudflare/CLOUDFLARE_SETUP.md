# Cloudflare Workers Setup for neo.khulnasoft.com

This document outlines the Cloudflare Workers configuration for hosting NeoCode.

## Prerequisites

1. **Cloudflare Account**: Set up a Cloudflare account with the domain `khulnasoft.com`
2. **API Token**: Create a Cloudflare API token with `Zone:Edit` and `Account:Cloudflare Pages:Edit` permissions
3. **KV Namespaces**: Create KV namespaces for caching and sessions

## KV Namespaces Setup

Create the following KV namespaces in your Cloudflare dashboard:

### Production Environment

- `CACHE`: For caching responses and assets
- `SESSIONS`: For user session management (console app)

### Development Environment

- `CACHE`: Development cache namespace
- `SESSIONS`: Development sessions namespace

Update the `wrangler.toml` files with your KV namespace IDs:

```bash
# Get KV namespace IDs
wrangler kv:namespace list

# Update wrangler.toml files with your IDs
```

## Domain Configuration

### Main Domain (neo.khulnasoft.com)

- Console app: `neo.khulnasoft.com/*`
- Documentation: `neo.khulnasoft.com/docs/*`

### Staging Domains

- Dev: `dev.neo.khulnasoft.com/*`
- Staging: `staging.neo.khulnasoft.com/*`

## Deployment

### Manual Deployment

```bash
# Deploy to development
STAGE=dev ./script/deploy-cloudflare.ts

# Deploy to production
STAGE=production ./script/deploy-cloudflare.ts
```

### Automatic Deployment

- Push to `dev` branch → deploys to `dev.neo.khulnasoft.com`
- Push to `production` branch → deploys to `neo.khulnasoft.com`

## GitHub Secrets

Add these secrets to your GitHub repository:

1. `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token
2. `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID (optional)

## Architecture

### Web Documentation (`packages/web`)

- **Framework**: Astro with Starlight
- **Adapter**: Cloudflare Workers
- **Route**: `/docs/*`
- **Build Output**: Server-side rendered

### Console Application (`packages/console/app`)

- **Framework**: SolidJS with Nitro
- **Adapter**: Cloudflare Module Workers
- **Route**: `/*` (catch-all)
- **Features**: Authentication, dashboard, API endpoints

## Environment Variables

The applications use these environment variables:

- `VITE_API_URL`: API endpoint URL
- `VITE_AUTH_URL`: Authentication URL

## DNS Configuration

Ensure your DNS is configured correctly:

```
A    neo.khulnasoft.com    -> Cloudflare proxy
A    dev.neo.khulnasoft.com -> Cloudflare proxy
A    staging.neo.khulnasoft.com -> Cloudflare proxy
```

## Monitoring

Monitor your deployments through:

- Cloudflare Analytics
- Workers Logs
- GitHub Actions deployment logs
