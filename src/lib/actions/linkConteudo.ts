"use server"

import { prisma } from "../neon/db";
import { LinkConteudo as LinkConteudoORM } from "@prisma/client";
// import { LinkConteudoInput } from "@/app/admin/linkConteudo/novo/page";

export async function getAllLinkConteudos(): Promise<LinkConteudoORM[]> {
    return await prisma.linkConteudo.findMany();
}

export async function findLinkConteudo(id: number): Promise<LinkConteudoORM | null> {
    return await prisma.linkConteudo.findUnique({ where: { id } });
}

// export async function createLinkConteudo({ titulo, ordem, url, status }: LinkConteudoInput) {
//     await prisma.linkConteudo.create({
//         data: {
//             titulo,
//             ordem,
//             url,
//             status: status === "ativo"
//         },
//     });
// }

export async function activateLinkConteudos(ids: number[]) {
    await Promise.all(
        ids.map(id => prisma.linkConteudo.update({ where: { id }, data: { status: true } }))
    );
}

export async function deactivateLinkConteudos(ids: number[]) {
    await Promise.all(
        ids.map(id => prisma.linkConteudo.update({ where: { id }, data: { status: false } }))
    );
}

export async function deleteLinkConteudos(ids: number[]) {
    await Promise.all(
        ids.map(id => prisma.linkConteudo.deleteMany({ where: { id } }))
    );
}