/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/lib/firebase/clientApp";
import { prisma } from "@/lib/neon/db";
import { collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import pLimit from 'p-limit';

interface VistaPagination {
  pagina: number;
  quantidade: number;
}

interface VistaResearchPayload {
  fields: (string | Record<string, string[] | string>)[] ; // Atualizado para suportar objetos aninhados como { Foto: [...] }
  paginacao?: VistaPagination; // Opcional para detalhes
}

interface VistaBaseParams {
  key: string;
  showtotal?: string; // showtotal é usado apenas em 'listar'
}

interface VistaApiResponse {
  total?: string; // Pode ser indefinido em 'detalhes'
  paginas?: string;
  pagina?: string;
  quantidade?: string;
  [propertyCode: string]: any; // Permite chaves dinâmicas como "12345"
}

interface VistaPropertyDetailPhoto {
  Destaque?: boolean; // Pode ser boolean da API
  Codigo?: string;
  Foto?: string;
  FotoPequena?: string;
}

interface VistaPropertyDetails {
  Foto?: Record<string, VistaPropertyDetailPhoto>;
  [key: string]: any; // Para outros campos de detalhes
}

// Interfaces para corresponder ao seu schema Prisma para inputs aninhados
interface ImovelPhotoCreateInput {
  destaque?: string | null;
  codigo?: string | null;
  url?: string | null;
  urlPequena?: string | null;
}

interface ImovelCaracteristicaCreateInput {
  nome: string;
  valor: string;
}

// --- Constantes ---
const VISTA_BASE_URL = "https://gruposou-rest.vistahost.com.br/imoveis";
const PROPERTIES_PER_PAGE = 50;

// Campos para a listagem (listar)
const LISTING_RESEARCH_FIELDS: string[] = [
  "Codigo", "ValorIptu", "ValorCondominio", "Categoria", "InformacaoVenda", "ObsVenda",
  "AreaTerreno", "Bairro", "GMapsLatitude", "GMapsLongitude", "DescricaoWeb", "Cidade",
  "ValorVenda", "ValorLocacao", "Dormitorios", "Suites", "Vagas", "AreaTotal", "AreaPrivativa",
  "Caracteristicas", "InfraEstrutura", "Descricao", "DataHoraAtualizacao", "Lancamento",
  "Finalidade", "Status", "Empreendimento", "Endereco",
  "Numero", "Complemento", "UF", "CEP", "DestaqueWeb", "FotoDestaque", "Latitude", "Longitude",
  "TituloSite", "FotoDestaqueEmpreendimento", "VideoDestaque", "Mobiliado"
];

// Campos para os detalhes (detalhes) - inclui a estrutura de fotos
const DETAIL_RESEARCH_FIELDS: (string | Record<string, string[]>)[] = [
    ...LISTING_RESEARCH_FIELDS, // Inclui todos os campos da listagem
    { Foto: ["Foto", "FotoPequena", "Destaque"] } // ✨ ADICIONADO: Para buscar detalhes da foto
];

const BASE_PARAMS_LISTING: VistaBaseParams = {
  key: process.env.VISTA_KEY!,
  showtotal: "1"
};

const BASE_PARAMS_DETAILS: VistaBaseParams = {
    key: process.env.VISTA_KEY!,
};


// --- Funções Auxiliares ---

/**
 * Constrói a URL para buscar as listagens de imóveis.
 * @param {number} page O número da página a ser buscada.
 * @returns {string} A URL completa para a API de listagem.
 */
const buildListingsUrl = (page: number): string => {
  const researchPayload: VistaResearchPayload = {
    fields: LISTING_RESEARCH_FIELDS,
    paginacao: {
      pagina: page,
      quantidade: PROPERTIES_PER_PAGE,
    },
  };

  const params = new URLSearchParams({
    ...BASE_PARAMS_LISTING,
    pesquisa: JSON.stringify(researchPayload),
  });

  return `${VISTA_BASE_URL}/listar?${params}`;
};

/**
 * Constrói a URL para buscar os detalhes de um imóvel, incluindo fotos.
 * ✨ CORRIGIDO: Esta função agora usa a lógica do seu makeUrlCadastraDetalhes
 * @param {string} propertyCode O código único do imóvel.
 * @returns {string} A URL completa para a API de detalhes do imóvel.
 */
const buildDetailsUrl = (propertyCode: string): string => {
    const researchPayload: VistaResearchPayload = {
        fields: DETAIL_RESEARCH_FIELDS, // ✨ Usa os campos de detalhe que incluem a estrutura 'Foto'
    };

    const params = new URLSearchParams({
        ...BASE_PARAMS_DETAILS,
        pesquisa: JSON.stringify(researchPayload),
        imovel: propertyCode // ✨ O código do imóvel é passado como parâmetro 'imovel'
    });

    return `${VISTA_BASE_URL}/detalhes?${params}`;
};


/**
 * Extrai os dados dos imóveis da resposta da API, excluindo metadados.
 * @param {VistaApiResponse} apiData Os dados brutos recebidos da API.
 * @returns {Record<string, any>} Um objeto contendo apenas os dados dos imóveis, indexados pelo seu código.
 */
const extractProperties = (apiData: VistaApiResponse): Record<string, any> => {
  const properties: Record<string, any> = {};
  for (const key in apiData) {
    if (Object.prototype.hasOwnProperty.call(apiData, key) && !["total", "paginas", "pagina", "quantidade"].includes(key)) {
      properties[key] = apiData[key];
    }
  }
  return properties;
};

/**
 * Busca dados de uma URL fornecida.
 * @param {string} url A URL para buscar.
 * @returns {Promise<T>} Os dados da resposta em formato JSON.
 * @throws {Error} Se a requisição de rede falhar ou a resposta não for OK.
 */
async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url, { headers: { Accept: "application/json" } });
  if (!response.ok) {
    throw new Error(`Falha ao buscar dados de ${url}. Status: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

interface VistaPropertyData {
    Codigo?: string;
    Cidade?: string;
    ValorVenda?: string | null;
    ValorLocacao?: string | null;
    Dormitorios?: string;
    Suites?: string;
    Vagas?: string;
    AreaTotal?: string;
    AreaPrivativa?: string;
    DataHoraAtualizacao?: string;
    Lancamento?: string;
    Mobiliado?: string;
    Caracteristicas?: Record<string, any>;
    Foto?: Record<string, VistaPropertyDetailPhoto>;
    CodigoImobiliaria?: string; // ✨ Add CodigoImobiliaria to the interface to be safe
    [key: string]: any; // Permite outros campos dinâmicos da API Vista
}

// ... (restante do código até processAndUpsertProperty)

/**
 * Processa um único imóvel, busca seus detalhes e o insere/atualiza no banco de dados.
 * @param {string} code O código do imóvel.
 * @param {VistaPropertyData} propertyData Os dados iniciais do imóvel.
 */
const processAndUpsertProperty = async (code: string, propertyData: VistaPropertyData): Promise<void> => {
  try {
    // ✨ Include 'CodigoImobiliaria' in the destructuring
    const { Caracteristicas, Foto, DataHoraAtualizacao, Cidade, CodigoImobiliaria, ...restOfProperty } = propertyData || {};

    console.log(Foto)
    console.log(CodigoImobiliaria)

    const validDataHoraAtualizacao: string =
      DataHoraAtualizacao && !isNaN(Date.parse(DataHoraAtualizacao))
        ? new Date(DataHoraAtualizacao).toISOString()
        : new Date().toISOString();

    const details: VistaPropertyDetails = await fetchData<VistaPropertyDetails>(buildDetailsUrl(code)).catch(err => {
        console.warn(`Não foi possível buscar detalhes para o imóvel ${code}: ${err.message}`);
        return {};
    });

    const photosToCreate: ImovelPhotoCreateInput[] = Object.values(details.Foto || {}).map((photo: VistaPropertyDetailPhoto) => ({
      destaque: photo.Destaque !== undefined && photo.Destaque !== null ? String(photo.Destaque) : null,
      codigo: photo.Codigo ?? null,
      url: photo.Foto ?? null,
      urlPequena: photo.FotoPequena ?? null,
    }));

    const characteristicsToCreate: ImovelCaracteristicaCreateInput[] = Object.entries(Caracteristicas || {}).map(([key, value]: [string, any]) => ({
      nome: key,
      valor: String(value),
    }));

    const parseToInt = (value: string | null | undefined): number | null => {
        if (value === null || value === undefined || value.trim() === '') {
            return null;
        }
        const parsed = parseInt(value, 10);
        return isNaN(parsed) ? null : parsed;
    };

    const valorVendaInt = parseToInt(restOfProperty.ValorVenda);
    const valorLocacaoInt = parseToInt(restOfProperty.ValorLocacao);

    const photosUpdateOperations: any = {};
    if (photosToCreate.length > 0) {
        photosUpdateOperations.fotos = {
            deleteMany: {},
            create: photosToCreate,
        };
    }

    const caracteristicasUpdateOperations: any = {};
    if (characteristicsToCreate.length > 0) {
        caracteristicasUpdateOperations.caracteristicas = {
            deleteMany: {},
            create: characteristicsToCreate,
        };
    }

    await prisma.imovel.upsert({
      where: { id: code },
      update: {
        ...restOfProperty,
        Cidade: Cidade,
        ValorVenda: valorVendaInt,
        ValorLocacao: valorLocacaoInt,
        DataHoraAtualizacao: validDataHoraAtualizacao,
        ...photosUpdateOperations,
        ...caracteristicasUpdateOperations,
      },
      create: {
        id: code,
        ...restOfProperty,
        Cidade: Cidade,
        ValorVenda: valorVendaInt,
        ValorLocacao: valorLocacaoInt,
        DataHoraAtualizacao: validDataHoraAtualizacao,
        fotos: {
          create: photosToCreate
        },
        caracteristicas: {
          create: characteristicsToCreate
        },
      },
    });
    console.log(`Imóvel ${code} processado e upserted com sucesso.`);
  } catch (error: any) {
    console.error(`Erro ao processar imóvel ${code}:`, error.message);
  }
};

export async function POST() {
  try {
    // 1. Busca a primeira página para determinar o total de páginas
    const firstPageUrl: string = buildListingsUrl(1);
    const firstPageData: VistaApiResponse = await fetchData<VistaApiResponse>(firstPageUrl);
    const totalPages: number = Number(firstPageData.paginas) || 1;

    let allProperties: Record<string, any> = extractProperties(firstPageData);

    // 2. Busca concorrentemente os dados das páginas restantes
    const pagePromises: Promise<Record<string, any>>[] = [];
    for (let page = 2; page <= totalPages; page++) {
      pagePromises.push(
        fetchData<VistaApiResponse>(buildListingsUrl(page))
          .then(data => extractProperties(data))
          .catch(err => {
            console.warn(`Falha ao buscar página ${page}: ${err.message}`);
            return {};
          })
      );
    }

    // Aguarda todas as buscas de página serem concluídas e consolida os imóveis
    const results: Record<string, any>[] = await Promise.all(pagePromises);
    results.forEach(pageProperties => {
      allProperties = { ...allProperties, ...pageProperties };
    });

    // ✨ AQUI ESTÁ A MUDANÇA PRINCIPAL PARA O CONTROLE DE CONCORRÊNCIA
    const CONCURRENCY_LIMIT = 5; // ✨ Ajuste este valor conforme a capacidade do seu DB
    const limit = pLimit(CONCURRENCY_LIMIT);

    console.log(`Iniciando processamento de ${Object.keys(allProperties).length} imóveis com limite de concorrência de ${CONCURRENCY_LIMIT}.`);

    const propertyProcessingPromises: PromiseSettledResult<void>[] = await Promise.allSettled(
      Object.entries(allProperties).map(([code, property]) =>
        limit(() => processAndUpsertProperty(code, property)) // ✨ Usa 'limit' para envolver a função
      )
    );

    propertyProcessingPromises.forEach((result, index) => {
      const propertyCode = Object.keys(allProperties)[index];
      if (result.status === 'rejected') {
        console.error(`A promessa para o imóvel ${propertyCode} foi rejeitada durante o processamento:`, result.reason);
      } else {
        // Você pode remover este console.log se quiser, já que processAndUpsertProperty já loga sucesso.
        // console.log(`Imóvel ${propertyCode} processado com sucesso.`);
      }
    });

    return NextResponse.json({
      message: "Sincronização de imóveis e detalhes concluída. Verifique os logs do servidor para o status de cada imóvel.",
      totalPropertiesAttempted: Object.keys(allProperties).length,
      successful: propertyProcessingPromises.filter(p => p.status === 'fulfilled').length,
      failed: propertyProcessingPromises.filter(p => p.status === 'rejected').length,
    });
  } catch (error: any) {
    console.error("Erro crítico durante o processo de sincronização de imóveis:", error.message);
    return NextResponse.json({ error: "Erro interno do servidor durante a sincronização de imóveis" }, { status: 500 });
  } finally {
    // É importante desconectar o Prisma apenas quando todas as operações estão realmente concluídas.
    // O `Promise.allSettled` garante que todas as promessas foram resolvidas (sucesso ou falha).
    await prisma.$disconnect();
  }
}

export async function PUT() {
  try {
    const imoveisParaAtualizar: Record<string, any> = {}
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normaliza para comparar só a data

    const basePesquisa = {
      fields: LISTING_RESEARCH_FIELDS,
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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    console.log("Received search parameters:", (searchParams.toString()));
    const codigo = searchParams.get("codigo") || null; // Extract codigo early

    // --- Special handling for 'codigo' ---
    if (codigo) {
      const imovel = await prisma.imovel.findUnique({
        where: {
          id: codigo,
        },
        include: {
          fotos: {
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
          caracteristicas: {
            select: {
              nome: true,
              valor: true
            }
          }
        },
      });

      if (imovel) {
        return NextResponse.json({
          currentPage: 1,
          pageSize: 1,
          totalPages: 1,
          totalItems: 1,
          imoveis: [imovel], // Return as an array for consistency
        });
      } else {
        return NextResponse.json({
          currentPage: 1,
          pageSize: 0,
          totalPages: 0,
          totalItems: 0,
          imoveis: [],
        }, { status: 404 }); // Return 404 if not found
      }
    }
    
    const action = searchParams.get("action") ?? "comprar";

    const tipos = searchParams.get("tipos")
      ?.split(",")
      .map(item => item.trim())
      .filter(Boolean) || [];
    const bairros = searchParams.get("bairro")
      ?.split(",")
      .map(item => item.trim())
      .filter(Boolean) || [];

    const cidade = searchParams.get("cidade") ?? "piracicaba";
    const valorMin = searchParams.get("valorMin") ? Number(searchParams.get("valorMin")) : null;
    const valorMax = searchParams.get("valorMax") ? Number(searchParams.get("valorMax")) : null;
    const quartos = searchParams.get("quartos") || null;
    const areaMinima = searchParams.get("areaMinima") ? String(searchParams.get("areaMinima")) : null; // AreaTotal ainda é string
    const suites = searchParams.get("suites") || null;
    const vagas = searchParams.get("vagas") || null;
    const caracteristicas = searchParams.get("caracteristicas")?.split(",").filter(Boolean) || [];

    let lancamentosFilterValue: "Sim" | "Nao" | null = null;
    const rawLancamentos = searchParams.get("lancamentos");
    if (rawLancamentos !== null) {
        const normalized = rawLancamentos.toLowerCase().trim();
        if (["sim", "s", "true"].includes(normalized)) {
            lancamentosFilterValue = "Sim";
        } else if (["nao", "n", "false"].includes(normalized)) {
            lancamentosFilterValue = "Nao";
        }
    }

    let mobiliadoFilterValue: "Sim" | "Nao" | null = null;
    const rawMobiliado = searchParams.get("mobiliado");
    if (rawMobiliado !== null) {
        const normalized = rawMobiliado.toLowerCase().trim();
        if (["sim", "s", "true"].includes(normalized)) {
            mobiliadoFilterValue = "Sim";
        } else if (["nao", "n", "false"].includes(normalized)) {
            mobiliadoFilterValue = "Nao";
        }
    }

    const order = searchParams.get("order") || null;

    const pageSize = Number(searchParams.get("pageSize")) || 12;
    const page = Number(searchParams.get("page")) || 1;
    const skip = (page - 1) * pageSize;

    const isAluguel = action.toLowerCase() === "alugar";
    const valorField = isAluguel ? "ValorLocacao" : "ValorVenda"; // 'ValorLocacao' ou 'ValorVenda'

    const whereClause: any = {
      Status: isAluguel ? "ALUGUEL" : "VENDA",
    };

    if (cidade) whereClause.Cidade = { equals: cidade, mode: 'insensitive' };
    if (bairros.length > 0 && !(bairros.length === 1 && bairros[0].toLowerCase() === "all")) {
      whereClause.Bairro = { in: bairros, mode: 'insensitive' };
    }
    if (tipos.length > 0) {
      whereClause.Categoria = { in: tipos, mode: 'insensitive' };
    }
    if (quartos) whereClause.Dormitorios = quartos;
    if (suites) whereClause.Suites = suites;
    if (vagas) whereClause.Vagas = vagas;
    if (lancamentosFilterValue !== null) {
        whereClause.Lancamento = { equals: lancamentosFilterValue, mode: 'insensitive' };
    }
    if (mobiliadoFilterValue !== null) {
        whereClause.Mobiliado = { equals: mobiliadoFilterValue, mode: 'insensitive' };
    }

    if (valorMin !== null) {
      whereClause[valorField] = {
        gte: valorMin,
        ...whereClause[valorField],
      };
    }
    if (valorMax !== null) {
      whereClause[valorField] = {
        lte: valorMax,
        ...whereClause[valorField],
      };
    }

    if (areaMinima !== null) {
      whereClause.AreaTotal = {
        gte: String(areaMinima)
      };
    }

    if (caracteristicas.length > 0) {
      whereClause.caracteristicas = {
        some: {
          AND: caracteristicas.map(carac => ({
            nome: { equals: carac, mode: 'insensitive' },
            valor: { equals: "sim", mode: 'insensitive' }
          }))
        }
      };
    }

    const orderByClause: any = {};
    if (order) {
      switch (order) {
        case "MaiorValor":
          orderByClause[valorField] = "desc";
          break;
        case "MenorValor":
          orderByClause[valorField] = "asc";
          break;
        case "ImovelRecente":
          orderByClause.DataHoraAtualizacao = "desc";
          break;
        default:
          orderByClause[valorField] = "asc"; // Default pode ser por valor ou outro campo
      }
    } else {
      // Valor padrão de ordenação se 'order' não for fornecido
      orderByClause[valorField] = "asc"; // ou DataHoraAtualizacao: 'desc'
    }

    const [imoveis, totalCount] = await prisma.$transaction([
      prisma.imovel.findMany({
        where: whereClause,
        orderBy: orderByClause,
        take: pageSize,
        skip: skip,
        include: {
          fotos: {
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
          caracteristicas: {
              select: {
                  nome: true,
                  valor: true
              }
          }
        },
      }),
      prisma.imovel.count({
        where: whereClause,
      }),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    return NextResponse.json({
      currentPage: page,
      pageSize: pageSize,
      totalPages: totalPages,
      totalItems: totalCount,
      imoveis: imoveis,
    });
  } catch (error: any) {
    console.error("Erro ao buscar imóveis:", error.message);
    return NextResponse.json({ error: "Erro interno no servidor ao buscar imóveis" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE() {
  try {
    // 1. Deletar todas as Características
    // Isso deve ser feito antes de deletar os Imóveis se não houver onDelete: Cascade
    const deleteCaracteristicasResult = await prisma.caracteristica.deleteMany({});
    console.log(`Deletadas ${deleteCaracteristicasResult.count} características.`);

    // 2. Deletar todas as Fotos
    // Isso também deve ser feito antes de deletar os Imóveis se não houver onDelete: Cascade
    const deleteFotosResult = await prisma.foto.deleteMany({});
    console.log(`Deletadas ${deleteFotosResult.count} fotos.`);

    // 3. Deletar todos os Imóveis
    // Agora que as relações (filhos) foram deletadas, os Imóveis (pais) podem ser deletados
    const deleteImoveisResult = await prisma.imovel.deleteMany({});
    console.log(`Deletados ${deleteImoveisResult.count} imóveis.`);

    return NextResponse.json({
      message: "Todos os dados (características, fotos e imóveis) foram deletados com sucesso.",
      totalCaracteristicasDeleted: deleteCaracteristicasResult.count,
      totalFotosDeleted: deleteFotosResult.count,
      totalImoveisDeleted: deleteImoveisResult.count,
    });
  } catch (error: any) {
    console.error("Erro ao deletar todos os dados:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor ao deletar todos os dados.", details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect(); // Desconecta o Prisma Client após a operação
  }
}