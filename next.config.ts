/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    allowedOrigins: [
      "localhost:3000",
      "10.48.0.188:3000",
      "100.125.85.73:3000",
    ],
  },
};

export default nextConfig;
