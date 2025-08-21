import { prisma } from "../neon/db";

export async function getAllImoveisIds() {
  try {
    const imoveis = await prisma.imovel.findMany({
      select: {
        id: true,
      },
    });
    return imoveis;
  } catch (error) {
    console.error("Erro ao buscar imóveis:", error);
    return [];
  }
}