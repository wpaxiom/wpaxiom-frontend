/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'secure.gravatar.com' },
      { protocol: 'https', hostname: 'api.wpaxiom.com' },
      { protocol: 'https', hostname: '*.wp.com' },
    ],
  },
};

export default nextConfig;
