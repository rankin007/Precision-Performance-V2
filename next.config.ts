import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
