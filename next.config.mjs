/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    allowedDevOrigins: [
      "https://orientia.antjrobles.tech",
      "https://192.168.0.32:3003",
    ],
  },
};

export default nextConfig;
