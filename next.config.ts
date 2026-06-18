import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/floors",
        destination: "/hostel-floors",
      },
      {
        source: "/floors/:path*",
        destination: "/hostel-floors/:path*",
      },
      {
        source: "/contracts",
        destination: "/hostel-contracts",
      },
      {
        source: "/contracts/:path*",
        destination: "/hostel-contracts/:path*",
      },
      {
        source: "/allotments",
        destination: "/room-allotments",
      },
      {
        source: "/allotments/:path*",
        destination: "/room-allotments/:path*",
      },
      {
        source: "/payments",
        destination: "/room-allotment-payments",
      },
      {
        source: "/payments/:path*",
        destination: "/room-allotment-payments/:path*",
      },
      {
        source: "/contract-events",
        destination: "/hostel-contract-events",
      },
      {
        source: "/contract-events/:path*",
        destination: "/hostel-contract-events/:path*",
      },
      {
        source: "/contract-history",
        destination: "/hostel-contract-history",
      },
      {
        source: "/contract-history/:path*",
        destination: "/hostel-contract-history/:path*",
      },
    ];
  },
};

export default nextConfig;
