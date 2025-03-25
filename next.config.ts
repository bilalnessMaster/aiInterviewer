import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    'local-origin.dev', 
    '*.local-origin.dev' , 
    'https://f7be-105-76-123-95.ngrok-free.app/'],
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'lh3.googleusercontent.com',
        },
      ],
    },
};

export default nextConfig;
