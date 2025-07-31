import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.gruposouza.com.br',
        port: '',
        pathname: '/vista.imobi/fotos/**',
        search: '',
      },
    ],
  },
};
export default nextConfig;
