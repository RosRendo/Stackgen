import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: "https://stackgen.dashboardkiller.online/api/auth/:path*",
      },
      {
        source: "/projects/:path*",
        destination: "https://stackgen.dashboardkiller.online/projects/:path*",
      },
      {
        source: "/ai/:path*",
        destination: "https://stackgen.dashboardkiller.online/ai/:path*",
      },
      {
        source: "/paddle/:path*",
        destination: "https://stackgen.dashboardkiller.online/paddle/:path*",
      },
    ];
  },
};

export default nextConfig;
