"use server"

import { prisma } from "../neon/db";
import { Banners as BannerORM } from "@prisma/client";
import { BannerInput } from "@/app/admin/banners/novo/page";

export async function getAllBanners(): Promise<BannerORM[]> {
    return await prisma.banners.findMany()
}

export async function createBanner({titulo, subtitulo, imagem, url, status}: BannerInput) {
    imagem = 'teste'
  await prisma.banners.create({
    data: {
      titulo,
      subtitulo,
      url,
      imagem,
      status: status === "ativo"
    },
  });
}
