import { Banners as BannerORM } from "@prisma/client";
import { prisma } from "@/lib/neon/db";
import { Banner } from "@/lib/types/banners";

class BannersService {
    async saveBanner(banner: Banner): Promise<BannerORM> {
        const { titulo, subtitulo, url, imagem, status } = banner;
        return await prisma.banners.create({
            data: {
                titulo,
                subtitulo,
                url,
                imagem,
                status
            }
        })
    }

    async getAllBanners(): Promise<BannerORM[]> {
        return await prisma.banners.findMany()
    }
}