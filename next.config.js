/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'yncjrnftwivvatavfpba.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/BaitoAI-images/**',
      },
    ],
  },
};

module.exports = nextConfig;
