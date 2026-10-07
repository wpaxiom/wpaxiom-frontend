import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Tailwind produces a small stylesheet; inlining removes a render-blocking
    // request and its extra round trip for first-time mobile visitors.
    inlineCss: true,
  },
  // A stray package-lock.json in C:\Users\Shuvo (the global claude-code install)
  // makes Next infer the home folder as the workspace root, so Turbopack scans
  // and watches everything under it. Pin the root to this project.
  turbopack: {
    root: dirname(fileURLToPath(import.meta.url)),
  },
  // Allow ngrok tunnels to load dev resources (HMR, etc.) when testing
  // webhooks / plugin update-check against the local dev server.
  allowedDevOrigins: ['*.ngrok-free.app', '*.ngrok.io'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'secure.gravatar.com' },
      { protocol: 'https', hostname: 'api.wpaxiom.com' },
      { protocol: 'https', hostname: '*.wp.com' },
    ],
  },
};

export default nextConfig;
