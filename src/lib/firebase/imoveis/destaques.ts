import { collection, getDocs } from "firebase/firestore";
import { db } from "../clientApp";

export interface Destaque {
  id: string;
  AreaTotal: string;
  Bairro: string;
  Categoria: string;
  CodigoImobiliaria: string;
  Dormitorios: string;
  FotoDestaque: string;
  Lancamento: string;
  Status: string;
  Vagas: string;
  ValorLocacao: string;
  ValorVenda: string;
  DestaqueWeb: string;
}

export async function getDestaques() {
  const snapshot = await getDocs(collection(db, "imoveis"));
  const allDocs: Destaque[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Destaque);

  const usedIds = new Set<string>();
  const destaques = {
    lancamentos: [] as Destaque[],
    venda: [] as Destaque[],
    aluguel: [] as Destaque[],
  };

  for (const doc of allDocs) {
    if (doc.DestaqueWeb !== "Sim" || usedIds.has(doc.id)) continue;

    if (doc.Lancamento === "Sim" && destaques.lancamentos.length < 4) {
      destaques.lancamentos.push(doc);
    } else if (doc.Lancamento === "Nao" && doc.Status === "VENDA" && destaques.venda.length < 4) {
      destaques.venda.push(doc);
    } else if (doc.Lancamento === "Nao" && doc.Status === "ALUGUEL" && destaques.aluguel.length < 4) {
      destaques.aluguel.push(doc);
    }

    usedIds.add(doc.id);

    if (
      destaques.lancamentos.length === 4 &&
      destaques.venda.length === 4 &&
      destaques.aluguel.length === 4
    ) break;
  }

  return destaques;
}

