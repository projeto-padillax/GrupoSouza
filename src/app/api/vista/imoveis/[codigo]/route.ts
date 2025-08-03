import { db } from "@/lib/firebase/clientApp";
import { collection, doc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

// GET /api/imovel/[codigo]
export async function GET(_: Request, { params }: { params: { codigo: string } }) {
  try {
    const codigo = (await params).codigo
    const docRef = doc(collection(db, "imoveis"), codigo);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ error: "Imóvel não encontrado" }, { status: 404 });
    }

    return NextResponse.json(docSnap.data());
  } catch (error) {
    console.error("Erro ao buscar imóvel:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
