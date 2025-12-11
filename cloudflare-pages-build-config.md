# Cloudflare Pages Deployment Guide

This guide will help you deploy your static site to Cloudflare Pages.

## Quick Setup

### Option 1: Deploy via Cloudflare Dashboard (Recommended)

1. **Push your code to GitHub/GitLab/Bitbucket**
   - Make sure your repository is pushed to your Git provider

2. **Connect to Cloudflare Pages**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Navigate to **Pages** → **Create a project**
   - Click **Connect to Git**
   - Select your Git provider and authorize Cloudflare
   - Choose your repository (`emotion-craft`)

3. **Configure Build Settings**
   - **Framework preset**: `Vite` (or leave as "None")
   - **Build command**: `pnpm install && pnpm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (leave empty for root)

4. **Environment Variables** (if needed)
   - Add any environment variables in the **Environment variables** section
   - For production builds, you can set `NODE_ENV=production`

5. **Deploy**
   - Click **Save and Deploy**
   - Cloudflare will build and deploy your site
   - You'll get a URL like `emotion-craft.pages.dev`

### Option 2: Deploy via Wrangler CLI

1. **Install Wrangler CLI**
   ```bash
   pnpm add -D wrangler
   ```

2. **Login to Cloudflare**
   ```bash
   pnpm wrangler login
   ```

3. **Build your project**
   ```bash
   pnpm run build
   ```

4. **Deploy to Cloudflare Pages**
   ```bash
   pnpm wrangler pages deploy dist
   ```

## Build Configuration

- **Build command**: `pnpm install && pnpm run build`
- **Build output directory**: `dist`
- **Root directory**: `/` (root of the repository)
- **Node version**: Cloudflare Pages uses Node.js 18.x by default (compatible with your setup)

## Custom Domain Setup

1. In Cloudflare Pages dashboard, go to your project
2. Click **Custom domains** → **Set up a custom domain**
3. Enter your domain name
4. Follow DNS configuration instructions
5. Cloudflare will automatically provision SSL certificates

## Automatic Deployments

Cloudflare Pages automatically deploys:
- **Production**: Deploys from your default branch (usually `main` or `master`)
- **Preview**: Creates preview deployments for pull requests

## Troubleshooting

### Build Failures
- Check build logs in Cloudflare Pages dashboard
- Ensure `pnpm` is available (Cloudflare Pages supports pnpm)
- Verify all dependencies are in `package.json`

### 404 Errors on Routes
- For SPA routing, add a `_redirects` file in `public/`:
  ```
  /*    /index.html   200
  ```

### Environment Variables
- Add production environment variables in Cloudflare Pages dashboard
- Access via `import.meta.env.VITE_*` in your Vite app

## Additional Resources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#cloudflare-pages)

