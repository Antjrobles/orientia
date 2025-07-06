/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    allowedDevOrigins: ['orientia.antjrobles.tech'],
  },
  assetPrefix: 'https://orientia.antjrobles.tech',
};

export default nextConfig;