import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  // 禁用 Next.js 热重载，由 nodemon 处理重编译
  reactStrictMode: false,
  webpack: (config, { dev }) => {
    if (dev) {
      // 禁用 webpack 的热模块替换
      config.watchOptions = {
        ignored: ['**/*'], // 忽略所有文件变化
      };
    }
    return config;
  },
  eslint: {
    // 构建时忽略ESLint错误
    ignoreDuringBuilds: true,
  },
  // إعدادات Vercel و Prisma
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // تجنب مشاكل التخزين المؤقت في Vercel
  generateBuildId: async () => {
    return 'food-syria-app-build-' + Date.now();
  },
  // إعدادات خاصة بـ Prisma
  experimental: {
    // تمكين الميزات التجريبية إذا لزم الأمر
  },
};

export default nextConfig;
