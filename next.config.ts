import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
    ],
        dangerouslyAllowSVG: true,  // Optional: if you have SVGs
    // Allow localhost for development
    unoptimized: process.env.NODE_ENV === 'development',  // ← Add this
  },
};

export default nextConfig;
