// === SERVER ACTIONS ESPECÍFICAS ===

"use server";

import { z } from "zod";
import { revalidatePath } from 'next/cache';
import { prisma } from '../neon/db';

// === AÇÕES PARA PÁGINAS ===

const paginaSchema = z.object({
  titulo: z.string().min(1, "Título é obrigatório.").max(100),
  ordem: z.number().min(0, "Ordem deve ser positiva."),
  conteudo: z.string().optional(),
  imagem: z.string().optional(),
  isOnMenu: z.boolean().default(true),
  status: z.boolean().default(true),
  url: z.string().url("URL inválida").optional(),
  tipo: z.enum(["pagina", "link"]),
  createdAt: z.date().optional(),
  publicId: z.string().optional(),
});

export type PaginaInput = z.infer<typeof paginaSchema>;

export async function createPagina(data: PaginaInput) {
  try {
    const validatedData = paginaSchema.parse(data);

    const pagina = await prisma.paginasConteudo.create({
      data: validatedData
    });

    revalidatePath('/admin/paginas');
    console.log(`✅ Página criada:`, pagina.id);
    return pagina;
  } catch (error) {
    console.error('Erro ao criar página:', error);
    
    throw new Error('Erro ao criar página');
  }
}

export async function updatePagina(id: number, data: PaginaInput) {
  try {
    const validatedData = paginaSchema.parse(data);

    const pagina = await prisma.paginasConteudo.update({
      where: { id },
      data: validatedData
    });

    revalidatePath('/admin/paginas');
    console.log(`✅ Página atualizada:`, pagina.id);
    return pagina;
  } catch (error) {
    console.error('Erro ao atualizar página:', error);

    throw new Error('Erro ao atualizar página');
  }
}


export async function activatePaginas(ids: number[]) {
  try {
    await prisma.paginasConteudo.updateMany({
      where: { id: { in: ids } },
      data: { status: true }
    });

    revalidatePath('/admin/paginas');
    console.log(`✅ ${ids.length} páginas ativadas:`, ids);
  } catch (error) {
    console.error('Erro ao ativar páginas:', error);
    throw new Error('Erro ao ativar páginas');
  }
}

export async function deactivatePaginas(ids: number[]) {
  try {
    await prisma.paginasConteudo.updateMany({
      where: { id: { in: ids } },
      data: { status: false }
    });

    revalidatePath('/admin/paginas');
    console.log(`✅ ${ids.length} páginas desativadas:`, ids);
  } catch (error) {
    console.error('Erro ao desativar páginas:', error);
    throw new Error('Erro ao desativar páginas');
  }
}

export async function deletePaginas(ids: number[]) {
  try {
    const result = await prisma.paginasConteudo.deleteMany({
      where: { id: { in: ids } }
    });

    revalidatePath('/admin/paginas');
    console.log(`✅ ${result.count} páginas excluídas:`, ids);
  } catch (error) {
    console.error('Erro ao excluir páginas:', error);
    throw new Error('Erro ao excluir páginas');
  }
}


export async function getAllPaginasConteudo() {
  try {
    return await prisma.paginasConteudo.findMany({
      orderBy: { ordem: 'asc' }
    });
  } catch (error) {
    console.error('Erro ao buscar páginas:', error);
    throw new Error('Erro ao buscar páginas');
  }
}

export async function getPaginaById(id: number) {
  try {
    return await prisma.paginasConteudo.findUnique({
      where: { id }
    });
  } catch (error) {
    console.error('Erro ao buscar página:', error);
    throw new Error('Erro ao buscar página');
  }
}