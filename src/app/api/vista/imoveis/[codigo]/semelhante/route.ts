import { db } from "@/lib/firebase/clientApp";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  limit,
} from "firebase/firestore";
import { NextResponse } from "next/server";

type Imovel = {
  Codigo: string;
  Cidade: string;
  Finalidade: "RESIDENCIAL" | "COMERCIAL";
  Categoria: string;
  Status: "VENDA" | "ALUGUEL" | "VENDA E ALUGUEL";
  ValorVenda?: string;
  ValorLocacao?: string; 
};

type ImovelFirestore = Omit<Imovel, "Codigo">;

const STATUS_COMPATIVEIS = {
  venda: ["VENDA", "VENDA E ALUGUEL"] as const,
  aluguel: ["ALUGUEL", "VENDA E ALUGUEL"] as const,
};

function toNumberSafe(v?: string): number | null {
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function decideModalidade(base: Imovel, explicit?: "venda" | "aluguel"): "venda" | "aluguel" {
  if (explicit) return explicit;
  const venda = toNumberSafe(base.ValorVenda);
  const loc = toNumberSafe(base.ValorLocacao);
  if (venda && venda > 0) return "venda";
  if (loc && loc > 0) return "aluguel";
  if (base.Status === "ALUGUEL") return "aluguel";
  return "venda";
}

export async function GET(req: Request, { params }: { params: { codigo: string } }) {
  try {
    
    const url = new URL(req.url);
    const explicitModalidade = url.searchParams.get("modalidade") as "venda" | "aluguel" | null;

    const codigo = params.codigo;
    const ref = doc(collection(db, "imoveis"), codigo);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      return NextResponse.json({ error: "Imóvel não encontrado" }, { status: 404 });
    }

    const base = { Codigo: codigo, ...(snap.data() as ImovelFirestore) } as Imovel;

    const modalidade = decideModalidade(base, explicitModalidade ?? undefined);
    const priceField = modalidade === "venda" ? "ValorVenda" : "ValorLocacao";
    const basePrice = toNumberSafe(base[priceField as keyof Imovel] as string | undefined);

    if (!basePrice || basePrice <= 0) {
      return NextResponse.json(
        { error: `Imóvel base sem ${priceField} válido para comparação` },
        { status: 400 }
      );
    }

    const min = basePrice * 0.85;
    const max = basePrice * 1.15;

    const cidade = base.Cidade;
    const finalidade = base.Finalidade;
    const categoria = base.Categoria;

    const statusCompat = STATUS_COMPATIVEIS[modalidade];

    const col = collection(db, "imoveis");
    const q = query(
      col,
      where("Cidade", "==", cidade),
      where("Finalidade", "==", finalidade),
      where("Categoria", "==", categoria),
      where("Status", "in", statusCompat as unknown as string[]),
      limit(100)
    );

    const qs = await getDocs(q);

    const candidatos: Array<{ imovel: Imovel; preco: number; delta: number }> = [];

    qs.forEach((docSnap) => {
      if (!docSnap.exists()) return;
      const data = docSnap.data() as ImovelFirestore;
      const candidato: Imovel = { Codigo: docSnap.id, ...data };

      if (candidato.Codigo === base.Codigo) return;

      const p = toNumberSafe(candidato[priceField as keyof Imovel] as string | undefined);
      if (!p || p <= 0) return;

      if (p < min || p > max) return;

      const delta = Math.abs(p - basePrice);
      candidatos.push({ imovel: candidato, preco: p, delta });
    });

    candidatos.sort((a, b) => a.delta - b.delta);
    const top4 = candidatos.slice(0, 4).map((c) => c.imovel);

    return NextResponse.json({
      base: { codigo: base.Codigo, modalidade, priceField, basePrice },
      semelhantes: top4,
    });
  } catch (err) {
    console.error("Erro ao buscar imóveis semelhantes:", err);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
