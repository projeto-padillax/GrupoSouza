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
}

export async function getDestaques() {
  const snapshot = await getDocs(collection(db, "imoveis"));
  const allDocs: Destaque[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Destaque);

  const lancamentos = allDocs
    .filter((doc) => doc.Lancamento === 'Sim')
    .slice(0, 4);

  const venda = allDocs
    .filter((doc) => doc.Status === 'VENDA')
    .slice(0, 4);

  const aluguel = allDocs
    .filter((doc) => doc.Status === 'ALUGUEL')
    .slice(0, 4);

    console.log(lancamentos.length)
    console.log(venda.length)
    console.log(aluguel.length)

  return [...lancamentos, ...venda, ...aluguel];
}