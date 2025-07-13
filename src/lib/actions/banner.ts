"use server"

import { prisma } from "../neon/db";
import { Banners as BannerORM } from "@prisma/client";
import { BannerInput } from "@/app/admin/banners/novo/page";

export async function getAllBanners(): Promise<BannerORM[]> {
    return await prisma.banners.findMany()
}

export async function findBanner(id: number): Promise<BannerORM | null> {
    return await prisma.banners.findUnique({ where: { id } })
}

export async function createBanner({ titulo, subtitulo, imagem, url, status }: BannerInput) {
    imagem = 'teste'
    await prisma.banners.create({
        data: {
            titulo,
            subtitulo,
            url,
            imagem,
            status
        },
    });
}

export async function updateBanner(banner: Omit<BannerORM, "createdAt">) {
    const { id, ...bannerWithoutId } = banner;

    console.log(bannerWithoutId)

    await prisma.banners.update({
        where: { id },
        data: {...bannerWithoutId, imagem: "teste" },
    });
}

export async function activateBanners(ids: number[]) {
    await Promise.all(
        ids.map(id => prisma.banners.update({ where: { id }, data: { status: true } }))
    );
}

export async function deactivateBanners(ids: number[]) {
    await Promise.all(
        ids.map(id => prisma.banners.update({ where: { id }, data: { status: false } }))
    );
}

export async function deleteBanners(ids: number[]) {
    await Promise.all(
        ids.map(id => prisma.banners.deleteMany({ where: { id } }))
    );
}