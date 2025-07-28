import { db } from "@/lib/firebase/clientApp";
import { doc, setDoc } from "firebase/firestore";

export async function POST(request: Request) {
  try {
    const basePesquisa = {
      fields: [
        "Codigo", "Categoria", "Bairro", "Cidade", "ValorVenda", "ValorLocacao",
        "Dormitorios", "Suites", "Vagas", "AreaTotal", "AreaPrivativa",
        "Caracteristicas", "InfraEstrutura", "Aberturas", "FotoDestaque",
        "FotoDestaquePequena", "Latitude", "Longitude", "Status", "Finalidade",
        "DataHoraAtualizacao"
      ],
      paginacao: {
        pagina: 1,
        quantidade: 50
      }
    };

    const baseParams = {
      key: process.env.VISTA_KEY!,
      showtotal: "1"
    };

    const makeUrl = (pagina: number) => {
      const pesquisa = {
        ...basePesquisa,
        paginacao: { pagina, quantidade: basePesquisa.paginacao.quantidade }
      };
      const params = new URLSearchParams({
        ...baseParams,
        pesquisa: JSON.stringify(pesquisa)
      });
      return `https://gruposou-rest.vistahost.com.br/imoveis/listar?${params}`;
    };

    const extrairImoveis = (data: any) => {
      const imoveis: Record<string, any> = {};
      for (const key in data) {
        if (!["total", "paginas", "pagina", "quantidade"].includes(key)) {
          imoveis[key] = data[key];
        }
      }
      return imoveis;
    };

    // Pega a primeira página para saber total de páginas
    const firstResponse = await fetch(makeUrl(1), {
      method: "GET",
      headers: { Accept: "application/json" }
    });

    if (!firstResponse.ok) throw new Error("Falha ao obter página 1");

    const firstData = await firstResponse.json();

    const totalPaginas = Number(firstData.paginas) || 1;

    let todosImoveis: Record<string, any> = extrairImoveis(firstData);

    // Pega as demais páginas e junta os imóveis
    for (let pagina = 2; pagina <= totalPaginas; pagina++) {
      const response = await fetch(makeUrl(pagina), {
        method: "GET",
        headers: { Accept: "application/json" }
      });

      if (!response.ok) {
        console.warn(`Falha ao obter página ${pagina}`);
        continue;
      }

      const data = await response.json();
      const imoveisPagina = extrairImoveis(data);

      todosImoveis = { ...todosImoveis, ...imoveisPagina };
    }

    // Grava todos imóveis em documentos separados no Firestore
    await Promise.all(
      Object.entries(todosImoveis).map(([codigo, imovel]) =>
        setDoc(doc(db, "imoveis", codigo), imovel)
      )
    );

    return new Response(
      JSON.stringify({ message: "Imóveis armazenados com sucesso", total: Object.keys(todosImoveis).length }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Erro no POST:", error);
    return new Response(
      JSON.stringify({ error: "Erro interno no servidor" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export function GET() {
  return new Response("Method Not Allowed", { status: 405 });
}
