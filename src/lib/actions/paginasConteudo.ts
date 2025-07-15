"use server"

import { prisma } from "../neon/db";
import { PaginasConteudo } from "@prisma/client";
// import { PaginaConteudoInput } from "@/app/admin/paginasConteudo/novo/page";

export async function getAllPaginasConteudo(): Promise<PaginasConteudo[]> {
    return await prisma.paginasConteudo.findMany()
}

export async function findPaginaConteudo(id: number): Promise<PaginasConteudo | null> {
    return await prisma.paginasConteudo.findUnique({ where: { id } })
}

// export async function createPaginaConteudo({ titulo, conteudo, ordem, imagem, url, status, isOnMenu }: PaginaConteudoInput) {
//     await prisma.paginasConteudo.create({
//         data: {
//             titulo,
//             conteudo,
//             ordem,
//             imagem,
//             url,
//             status: status === "ativo",
//             isOnMenu: isOnMenu === "sim"
//         },
//     });
// }

export async function activatePaginasConteudo(ids: number[]) {
    await Promise.all(
        ids.map(id => prisma.paginasConteudo.update({ where: { id }, data: { status: true } }))
    );
}

export async function deactivatePaginasConteudo(ids: number[]) {
    await Promise.all(
        ids.map(id => prisma.paginasConteudo.update({ where: { id }, data: { status: false } }))
    );
}

export async function deletePaginasConteudo(ids: number[]) {
    await Promise.all(
        ids.map(id => prisma.paginasConteudo.deleteMany({ where: { id } }))
    );
}