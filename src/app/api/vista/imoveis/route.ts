/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeUrlCadastraDetalhes } from "@/lib/actions/imovel";
import { db } from "@/lib/firebase/clientApp";
import { collection, deleteDoc, doc, getDocs, limit, orderBy, query, setDoc, startAfter, where, getCountFromServer, updateDoc, getDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

const basePesquisaFields: string[] = [
  "Codigo", "ValorIptu", "ValorCondominio", "Categoria", "InformacaoVenda", "ObsVenda",
  "AreaTerreno", "Bairro", "GMapsLatitude", "GMapsLongitude", "DescricaoWeb", "Cidade",
  "ValorVenda", "ValorLocacao", "Dormitorios", "Suites", "Vagas", "AreaTotal", "AreaPrivativa",
  "Caracteristicas", "InfraEstrutura", "Descricao", "DataHoraAtualizacao", "Lancamento", "Codigo",
  "Descricao", "DescricaoWeb", "Finalidade", "Status", "Empreendimento", "Endereco",
  "Numero", "Complemento", "UF", "CEP", "DestaqueWeb", "FotoDestaque", "Latitude", "Longitude",
  "TituloSite", "Empreendimento", "FotoDestaqueEmpreendimento", "VideoDestaque", "Mobiliado"
]

export async function POST() {
  try {
    const basePesquisa = {
      fields: basePesquisaFields,
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

    // Busca e adiciona detalhes ao documento existente
    const cadastraDetalhes = async (codigo: string) => {
      const response = await fetch(makeUrlCadastraDetalhes(codigo), {
        method: "GET",
        headers: { Accept: "application/json" }
      });

      if (!response.ok) {
        console.warn(`Falha ao obter detalhes do imóvel ${codigo}`);
        return;
      }

      const detalhes = await response.json();
      const foto = detalhes.Foto;

      // Faz merge no documento existente
      await setDoc(doc(db, "imoveis", codigo), { Foto: foto }, { merge: true });
    };

    // Pega a primeira página
    const firstResponse = await fetch(makeUrl(1), {
      method: "GET",
      headers: { Accept: "application/json" }
    });

    if (!firstResponse.ok) throw new Error("Falha ao obter página 1");

    const firstData = await firstResponse.json();
    const totalPaginas = Number(firstData.paginas) || 1;
    let todosImoveis: Record<string, any> = extrairImoveis(firstData);

    // Demais páginas
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

    // Salva imóveis + adiciona detalhes
    await Promise.all(
      Object.entries(todosImoveis).map(async ([codigo, imovel]) => {
        await setDoc(doc(db, "imoveis", codigo), imovel); // cadastra básico
        await cadastraDetalhes(codigo); // faz merge dos detalhes
      })
    );

    return new Response(
      JSON.stringify({
        message: "Imóveis e detalhes armazenados com sucesso",
        total: Object.keys(todosImoveis).length
      }),
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

export async function PUT() {
  try {
    const imoveisParaAtualizar: Record<string, any> = {}
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normaliza para comparar só a data

    const basePesquisa = {
      fields: basePesquisaFields,
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

    const extrairImoveisAtualizadosHoje = (data: any) => {
      const imoveis: Record<string, any> = {};
      for (const key in data) {
        if (!["total", "paginas", "pagina", "quantidade"].includes(key)) {
          const imovel = data[key];
          const dataAtualizacao = new Date(imovel.DataHoraAtualizacao);
          imoveis[key] = imovel;
          if (dataAtualizacao.getTime() === today.getTime()) {
            imoveisParaAtualizar[key] = imovel
          }
        }
      }
      return imoveis;
    };

    // Pega primeira página
    const firstResponse = await fetch(makeUrl(1), {
      method: "GET",
      headers: { Accept: "application/json" }
    });

    if (!firstResponse.ok) throw new Error("Falha ao obter página 1");

    const firstData = await firstResponse.json();
    const totalPaginas = Number(firstData.paginas) || 1;

    let todosImoveis: Record<string, any> = extrairImoveisAtualizadosHoje(firstData);

    // pega as demais páginas
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
      const imoveisPagina = extrairImoveisAtualizadosHoje(data);
      todosImoveis = { ...todosImoveis, ...imoveisPagina };
    }

    // Atualiza/insere imóveis no Firestore
    await Promise.all(
      Object.entries(imoveisParaAtualizar).map(([codigo, imovel]) =>
        setDoc(doc(db, "imoveis", codigo), imovel)
      )
    );

    const snapshot = await getDocs(collection(db, "imoveis"));
    const codigosFirestore = snapshot.docs.map((doc) => doc.id);

    const codigosAPI = new Set(Object.keys(todosImoveis));

    // determina quais imóveis devem ser deletados
    const codigosParaDeletar = codigosFirestore.filter(
      (codigo) => !codigosAPI.has(codigo)
    );

    // // deleta os imóveis que não existem mais na API
    await Promise.all(
      codigosParaDeletar.map((codigo) =>
        deleteDoc(doc(db, "imoveis", codigo))
      )
    );

    return new Response(
      JSON.stringify({
        message: "Imóveis atualizados e obsoletos deletados com sucesso",
        atualizados: Object.keys(imoveisParaAtualizar).length,
        deletados: codigosParaDeletar.length
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Erro ao atualizar imóveis:", error);
    return new Response(
      JSON.stringify({ error: "Erro interno no servidor" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

interface Imovel {
  id: string;
  Cidade: string;
  ValorVenda?: number;
  ValorLocacao?: number;
  Status?: string;
  Categoria?: string;
  Bairro?: string;
  Dormitorios?: string;
  Codigo?: string;
  AreaTotal?: number;
  Suites?: number;
  Vagas?: number;
  Lancamento?: string;
  Mobiliado?: string;
  Caracteristicas?: string[];
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const action = searchParams.get("action") ?? "alugar";
    const tipos = searchParams.get("tipos")?.split(",").filter(Boolean) || [];
    const bairros = searchParams.get("bairro")?.split(",").filter(Boolean) || [];
    const cidade = searchParams.get("cidade") ?? "";
    const valorMin = searchParams.get("valorMin") ? Number(searchParams.get("valorMin")) : null;
    const valorMax = searchParams.get("valorMax") ? Number(searchParams.get("valorMax")) : null;
    const quartos = searchParams.get("quartos") || null;
    const codigo = searchParams.get("codigo") || null;
    const areaMinima = searchParams.get("areaMinima") ? Number(searchParams.get("areaMinima")) : null;
    const suites = searchParams.get("suites") || null;
    const vagas = searchParams.get("vagas") || null;
    const caracteristicas = searchParams.get("caracteristicas")?.split(",").filter(Boolean) || [];
    const lancamentos = searchParams.get("lancamentos") || null;
    const mobiliado = searchParams.get("mobiliado") || null;

    const isAluguel = action.toLowerCase() === "alugar";
    const valorField = isAluguel ? "ValorLocacao" : "ValorVenda";

    const pageSize = Number(searchParams.get("pageSize")) || 12;
    const cursor = searchParams.get("cursor") || null;

    const imoveisRef = collection(db, "imoveis");

    // =====================
    // Construir filtros Firestore (básicos)
    // =====================
    let firestoreConstraints: any[] = [
      where("Status", "==", isAluguel ? "ALUGUEL" : "VENDA"),
      orderBy(valorField)
    ];

    if (cidade) firestoreConstraints.push(where("CidadeLower", "==", cidade.toLowerCase())); // campo extra normalizado no banco
    if (tipos.length === 1) firestoreConstraints.push(where("CategoriaLower", "==", tipos[0].toLowerCase()));
    if (bairros.length === 1) firestoreConstraints.push(where("BairroLower", "==", bairros[0].toLowerCase()));
    if (valorMin !== null) firestoreConstraints.push(where(valorField, ">=", valorMin));
    if (valorMax !== null) firestoreConstraints.push(where(valorField, "<=", valorMax));

    // =====================
    // Total filtrado (base)
    // =====================
    const totalSnap = await getCountFromServer(query(imoveisRef, ...firestoreConstraints));
    const totalImoveis = totalSnap.data().count;

    // =====================
    // Paginação
    // =====================
    let pageConstraints = [...firestoreConstraints, limit(pageSize * 3)]; // busca extra p/ compensar filtros em memória

    if (cursor) {
      const lastDocRef = doc(imoveisRef, cursor);
      const lastDocSnap = await getDoc(lastDocRef);
      if (lastDocSnap.exists()) {
        pageConstraints.push(startAfter(lastDocSnap));
      }
    }

    const snapshot = await getDocs(query(imoveisRef, ...pageConstraints));

    let data: Imovel[] = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<Imovel, "id">),
    }));

    // =====================
    // Filtros em memória
    // =====================
    if (tipos.length > 1) {
      data = data.filter((item) => tipos.some((tipo) => item.Categoria?.toLowerCase() === tipo.toLowerCase()));
    }
    if (bairros.length > 1) {
      data = data.filter((item) => bairros.some((bairro) => item.Bairro?.toLowerCase() === bairro.toLowerCase()));
    }
    if (quartos) {
      data = data.filter((item) => String(item.Dormitorios) === String(quartos));
    }
    if (codigo) {
      data = data.filter((item) => String(item.Codigo) === String(codigo));
    }
    if (areaMinima) {
      data = data.filter((item) => Number(item.AreaTotal || 0) >= areaMinima);
    }
    if (suites) {
      data = data.filter((item) => String(item.Suites) === String(suites));
    }
    if (vagas) {
      data = data.filter((item) => String(item.Vagas) === String(vagas));
    }
    if (lancamentos !== null) {
      data = data.filter((item) => item.Lancamento?.toLowerCase() === lancamentos);
    }
    if (mobiliado !== null) {
      data = data.filter((item) => item.Mobiliado?.toLowerCase() === mobiliado);
    }
    if (caracteristicas.length) {
      data = data.filter((item) => {
        const caracObj: Record<string, any> = item.Caracteristicas || {};
        return caracteristicas.every((carac) => {
          const keyLower = carac.toLowerCase();
          const foundKey = Object.keys(caracObj).find((k) => k.toLowerCase() === keyLower);
          return foundKey ? String(caracObj[foundKey]).toLowerCase() === "sim" : false;
        });
      });
    }

    // =====================
    // Cortar para pageSize e definir próximo cursor
    // =====================
    data = data.slice(0, pageSize);

    const lastVisibleDoc = snapshot.docs.find(doc => doc.id === data[data.length - 1]?.id) || null;
    const nextCursor = lastVisibleDoc ? lastVisibleDoc.id : null;

    return NextResponse.json({
      total: totalImoveis,
      nextCursor,
      imoveis: data,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao buscar imóveis" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const imoveisRef = collection(db, "imoveis");
    const snapshot = await getDocs(imoveisRef);

    if (snapshot.empty) {
      return NextResponse.json({ message: "Nenhum registro encontrado." });
    }

    await Promise.all(
      snapshot.docs.map((document) => deleteDoc(doc(db, "imoveis", document.id)))
    );

    return NextResponse.json({
      message: `Todos os documentos foram deletados.`,
      totalDeleted: snapshot.size,
    });
  } catch (error: any) {
    console.error("Erro ao deletar documentos:", error);
    return NextResponse.json(
      { error: "Erro ao deletar documentos", details: error.message },
      { status: 500 }
    );
  }
}
