import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // `next/image` 로컬 src에 `?v=` 캐시 무효화 등 쿼리를 쓰려면 패턴 필요 (search 생략 시 모든 쿼리 허용)
    localPatterns: [
      { pathname: "/images/**" },
      { pathname: "/pdf/thumbnails/**" },
    ],
  },
};

export default nextConfig;
