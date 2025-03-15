import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https", // httpsプロトコルのみ許可
        hostname: "cdn.pixabay.com", // pixabayのCDNからの画像を許可
        port: "", // ポートの指定なし
        pathname: "/photo/**", // /photo/以下のパスからの画像を許可
      },
    ],
  },
};

export default nextConfig;
