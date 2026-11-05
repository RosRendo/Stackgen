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
        source: "/lemonsqueezy/:path*",
        destination: "https://stackgen.dashboardkiller.online/lemonsqueezy/:path*",
      },
    ];
  },
};

export default nextConfig;
