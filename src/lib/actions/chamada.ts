"use server"

import { prisma } from "../neon/db";
import { Chamadas as ChamadaORM } from "@prisma/client";
// import { ChamadaInput } from "@/app/admin/chamadas/novo/page";

export async function getAllChamadas(): Promise<ChamadaORM[]> {
    return await prisma.chamadas.findMany()
}

export async function findChamada(id: number): Promise<ChamadaORM | null> {
    return await prisma.chamadas.findUnique({ where: { id } })
}

// export async function createChamada({ titulo, subtitulo, ordem, imagem, url, status }: ChamadaInput) {
//     await prisma.chamadas.create({
//         data: {
//             titulo,
//             subtitulo,
//             ordem,
//             imagem,
//             url,
//             status: status === "ativo"
//         },
//     });
// }

export async function activateChamadas(ids: number[]) {
    await Promise.all(
        ids.map(id => prisma.chamadas.update({ where: { id }, data: { status: true } }))
    );
}

export async function deactivateChamadas(ids: number[]) {
    await Promise.all(
        ids.map(id => prisma.chamadas.update({ where: { id }, data: { status: false } }))
    );
}

export async function deleteChamadas(ids: number[]) {
    await Promise.all(
        ids.map(id => prisma.chamadas.deleteMany({ where: { id } }))
    );
}