/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false, // Hapus header X-Powered-By agar hacker tidak tahu framework yang digunakan
  allowedDevOrigins: [
    'localhost',
    '127.0.0.1',
    '192.168.1.*',
    '192.168.88.*',
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self)",
          },
        ],
      },
    ];
  },
  webpack: (config, { dev }) => {
    // Gunakan in-memory cache saat dev untuk mencegah error ENOENT .pack.gz di OS Windows
    if (dev) {
      config.cache = {
        type: 'memory',
      };
    }
    return config;
  },
};

export default nextConfig;


