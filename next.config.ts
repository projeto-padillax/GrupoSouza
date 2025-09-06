import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.gruposouza.com.br',
        pathname: '/vista.imobi/fotos/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'www.template.leadlink.com.br',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;
