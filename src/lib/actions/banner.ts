"use server"

import { prisma } from "../neon/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Banners as BannerORM } from "@prisma/client";

export async function getAllBanners(): Promise<BannerORM[]> {
    return await prisma.banners.findMany()
}

export async function createBanner(formData: any) {
  await prisma.banners.create({
    data: {
      ...formData
    },
  });

  revalidatePath("/admin/banners");
  redirect("/admin/banners");
}
