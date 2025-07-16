"use server"

import { z } from "zod";
import { prisma } from "../neon/db";
import { Chamadas as ChamadaORM } from "@prisma/client";

// Schema para validação no servidor
const chamadaServerSchema = z.object({
  titulo: z
    .string()
    .min(1, "Título é obrigatório.")
    .max(100, "Título deve ter no máximo 100 caracteres."),
  subtitulo: z
    .string()
    .min(1, "Subtítulo é obrigatório.")
    .max(200, "Subtítulo deve ter no máximo 200 caracteres."),
  ordem: z
    .number()
    .int("Ordem deve ser um número inteiro.")
    .positive("Ordem deve ser um número positivo."),
  imagem: z.string().min(1, "Imagem é obrigatória."),
  url: z
    .string()
    .min(1, "URL é obrigatória.")
    .url("URL inválida.")
    .refine(
      (url) => url.startsWith("https://"),
      { message: "URL deve começar com https://" }
    ),
  status: z.boolean(),
});

const idsSchema = z.array(z.number().positive());
const idSchema = z.number().positive();

export type chamadaSchema = z.infer<typeof chamadaServerSchema>

export async function getAllChamadas(): Promise<ChamadaORM[]> {
    try {
        return await prisma.chamadas.findMany({
            orderBy: { ordem: 'asc' }
        })
    } catch (error) {
        console.error("Erro ao buscar chamadas:", error);
        throw new Error("Erro ao buscar chamadas");
    }
}

export async function findChamada(id: number): Promise<ChamadaORM | null> {
    try {
        const validId = idSchema.parse(id);
        return await prisma.chamadas.findUnique({ where: { id: validId } })
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new Error("ID inválido");
        }
        console.error("Erro ao buscar chamada:", error);
        throw new Error("Erro ao buscar chamada");
    }
}

export async function createChamada({titulo, subtitulo, ordem, imagem, url, status}: chamadaSchema) {
    console.log(imagem)
    try {
        // Validar dados de entrada
        const validatedData = chamadaServerSchema.parse({
            titulo,
            subtitulo,
            ordem,
            url,
            status,
            imagem: 'teste'
        });

        await prisma.chamadas.create({
            data: {
                titulo: validatedData.titulo,
                subtitulo: validatedData.subtitulo,
                ordem: validatedData.ordem,
                imagem: validatedData.imagem,
                url: validatedData.url,
                status: validatedData.status
            },
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new Error(`Dados inválidos: ${error.message}`);
        }
        console.error("Erro ao criar chamada:", error);
        throw new Error("Erro ao criar chamada");
    }
}

export async function updateChamada(chamada: Omit<ChamadaORM, "createdAt">) {
    try {
        const { id, ...chamadaWithouId } = chamada;
        const validId = idSchema.parse(id);
        
        const validatedData = chamadaServerSchema.parse({
            ...chamadaWithouId,
            imagem: "teste" // Seu código atual
        });

        await prisma.chamadas.update({
            where: { id: validId },
            data: validatedData,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new Error(`Dados inválidos: ${error.message}`);
        }
        console.error("Erro ao atualizar chamada:", error);
        throw new Error("Erro ao atualizar chamada");
    }
}

export async function activateChamadas(ids: number[]) {
    try {
        const validIds = idsSchema.parse(ids);
        
        await prisma.$transaction(
            validIds.map(id => prisma.chamadas.update({ where: { id }, data: { status: true } }))
        );
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new Error("IDs inválidos");
        }
        console.error("Erro ao ativar chamadas:", error);
        throw new Error("Erro ao ativar chamadas");
    }
}

export async function deactivateChamadas(ids: number[]) {
    try {
        const validIds = idsSchema.parse(ids);
        
        await prisma.$transaction(
            validIds.map(id => prisma.chamadas.update({ where: { id }, data: { status: false } }))
        );
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new Error("IDs inválidos");
        }
        console.error("Erro ao desativar chamadas:", error);
        throw new Error("Erro ao desativar chamadas");
    }
}

export async function deleteChamadas(ids: number[]) {
    try {
        const validIds = idsSchema.parse(ids);
        
        await prisma.$transaction(
            validIds.map(id => prisma.chamadas.delete({ where: { id } }))
        );
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new Error("IDs inválidos");
        }
        console.error("Erro ao deletar chamadas:", error);
        throw new Error("Erro ao deletar chamadas");
    }
}