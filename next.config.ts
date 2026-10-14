import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 2592000,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'gbigguuhpzjqvfjgypmi.supabase.co',
      }
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [
      {
        source: '/rutas/desafio-5am',
        destination: '/desafios/desafio-5am',
        permanent: true,
      },
      {
        source: '/rutas/triple-corona',
        destination: '/desafios/triple-corona',
        permanent: true,
      },
      {
        source: '/rutas/sierra-de-ramon',
        destination: '/desafios/sierra-de-ramon',
        permanent: true,
      },
      {
        source: '/rutas/desbloqueando-santiago',
        destination: '/desafios/desbloqueando-santiago',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
