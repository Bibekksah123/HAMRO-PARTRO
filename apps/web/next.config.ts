import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@merodin/auth",
    "@merodin/date",
    "@merodin/db",
    "@merodin/types",
    "@merodin/ui",
  ],
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
