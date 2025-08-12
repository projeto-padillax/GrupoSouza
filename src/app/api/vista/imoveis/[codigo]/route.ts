import { prisma } from "@/lib/neon/db";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: Promise<{ codigo: string }> }) {
  try {
    const { codigo } = await params; // Destructure codigo directly from params

    const imovel = await prisma.imovel.findUnique({
      where: {
        id: codigo, // Query by the 'Codigo' field in your Prisma schema
      },
      include: {
        fotos: { // Include related photos
          select: {
            id: true,
            destaque: true,
            codigo: true,
            url: true,
            urlPequena: true,
          },
          orderBy: {
            id: 'asc'
          }
        },
        caracteristicas: { // Include related characteristics
          select: {
            nome: true,
            valor: true
          }
        }
      }
    });

    if (!imovel) {
      return NextResponse.json({ error: "Imóvel não encontrado" }, { status: 404 });
    }

    return NextResponse.json(imovel); // Return the found property
  } catch (error: any) { // Add type annotation for error
    console.error("Erro ao buscar imóvel:", error.message); // Log error message
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma client after the request
  }
}