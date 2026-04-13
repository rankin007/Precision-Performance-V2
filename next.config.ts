import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Horse photos and hero image are JPEG files stored with .png extensions.
    // Next.js 16 Turbopack image optimiser corrupts them due to format mismatch.
    // Serving unoptimized bypasses this and renders correctly.
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/pending-approval',
        destination: '/login',
        permanent: false,
      },
    ]
  },
};

export default nextConfig;
