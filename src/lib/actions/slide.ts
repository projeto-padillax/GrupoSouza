"use server"

import { prisma } from "../neon/db";
import { Slides as SlideORM } from "@prisma/client";
import { SlideInput } from "@/app/admin/slides/novo/page";

export async function getAllSlides(): Promise<SlideORM[]> {
    return await prisma.slides.findMany()
}

export async function createSlide({titulo, ordem, imagem, url, status}: SlideInput) {
    imagem = 'teste'
  await prisma.slides.create({
    data: {
      titulo,
      ordem,
      imagem,
      url,
      status: status === "ativo"
    },
  });
}
