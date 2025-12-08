# Cloudflare Pages Build Configuration

For Cloudflare Pages deployment, use these settings:

- **Build command**: `pnpm install && pnpm run build`
- **Build output directory**: `dist`
- **Root directory**: `/` (root of the repository)

The build will output static files to the `dist` directory, which Cloudflare Pages will serve.

