"use server";

import { z } from "zod";
import { prisma } from "../neon/db";
import { Banners as BannerORM } from "@prisma/client";
import { BannerInput } from "@/components/admin/bannerForm";

// Schema para validação no servidor
const bannerServerSchema = z.object({
  status: z.boolean(),
  titulo: z
    .string()
    .min(1, "Título é obrigatório.")
    .max(100, "Título deve ter no máximo 100 caracteres."),
  subtitulo: z
    .string()
    .min(1, "Subtítulo é obrigatório.")
    .max(200, "Subtítulo deve ter no máximo 200 caracteres."),
  url: z
    .string()
    .min(1, "URL é obrigatória.")
    .url("URL inválida.")
    .refine((url) => url.startsWith("https://"), {
      message: "URL deve começar com https://",
    }),
  imagem: z.string().min(1, "Imagem é obrigatória."),
});

const idsSchema = z.array(z.number().positive());
const idSchema = z.number().positive();

export async function getAllBanners(): Promise<BannerORM[]> {
  return await prisma.banners.findMany();
}

export async function findBanner(id: number): Promise<BannerORM | null> {
  // Validar ID
  const validId = idSchema.parse(id);
  return await prisma.banners.findUnique({ where: { id: validId } });
}

export async function createBanner({
  titulo,
  subtitulo,
  imagem,
  url,
  status,
}: BannerInput) {
  // Validar dados de entrada
  console.log(imagem)
  const validatedData = bannerServerSchema.parse({
    titulo,
    subtitulo,
    url,
    status,
    imagem: "teste", // Seu código atual
  });

  await prisma.banners.create({
    data: {
      titulo: validatedData.titulo,
      subtitulo: validatedData.subtitulo,
      url: validatedData.url,
      imagem: validatedData.imagem,
      status: validatedData.status,
    },
  });
}

export async function updateBanner(banner: Omit<BannerORM, "createdAt">) {
  const { id, ...bannerWithoutId } = banner;

  // Validar ID
  const validId = idSchema.parse(id);

  // Validar dados do banner
  const validatedData = bannerServerSchema.parse({
    ...bannerWithoutId,
    imagem: "teste", // Seu código atual
  });


  await prisma.banners.update({
    where: { id: validId },
    data: validatedData,
  });
}

export async function activateBanners(ids: number[]) {
  // Validar IDs
  const validIds = idsSchema.parse(ids);

  await prisma.$transaction(
    validIds.map((id) =>
      prisma.banners.update({ where: { id }, data: { status: true } })
    )
  );
}

export async function deactivateBanners(ids: number[]) {
  // Validar IDs
  const validIds = idsSchema.parse(ids);

  await prisma.$transaction(
    validIds.map((id) =>
      prisma.banners.update({ where: { id }, data: { status: false } })
    )
  );
}

export async function deleteBanners(ids: number[]) {
  // Validar IDs
  const validIds = idsSchema.parse(ids);

  await Promise.all(
    validIds.map((id) => prisma.banners.deleteMany({ where: { id } }))
  );
}
