/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
