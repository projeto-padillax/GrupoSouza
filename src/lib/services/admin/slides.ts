import { Slides as SlideORM } from "@prisma/client";
import { prisma } from "@/lib/neon/db";
import { Slides } from "@/lib/types/slides";

class SlidesService {
    async saveSlide(slide: Slides): Promise<SlideORM> {
        const { titulo, ordem, url, imagem, status } = slide;
        return await prisma.slides.create({
            data: {
                titulo,
                ordem,
                url,
                imagem,
                status
            }
        })
    }

    async getAllSlides(): Promise<SlideORM[]> {
        return await prisma.slides.findMany()
    }
}