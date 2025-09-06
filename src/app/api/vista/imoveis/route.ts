/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/neon/db";
import { NextRequest, NextResponse } from "next/server";
import pLimit from 'p-limit';

interface VistaPagination {
  pagina: number;
  quantidade: number;
}

interface VistaResearchPayload {
  fields: (string | Record<string, string[] | string>)[]; // Atualizado para suportar objetos aninhados como { Foto: [...] }
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
const VISTA_BASE_URL = "https://multiimo-rest.vistahost.com.br/imoveis";
const PROPERTIES_PER_PAGE = 50;

// Campos para a listagem (listar)
const LISTING_RESEARCH_FIELDS: string[] = [
  "Codigo", "ValorIptu", "ValorCondominio", "Categoria", "InformacaoVenda", "ObsVenda",
  "AreaTerreno", "Bairro", "GMapsLatitude", "GMapsLongitude", "DescricaoWeb", "Cidade",
  "ValorVenda", "ValorLocacao", "Dormitorios", "Suites", "Vagas", "AreaTotal",
  "Caracteristicas", "Descricao", "DataHoraAtualizacao", "Lancamento",
  "Finalidade", "Status", "Empreendimento", "Endereco",
  "Numero", "Complemento", "UF", "CEP", "DestaqueWeb", "FotoDestaque", "Latitude", "Longitude",
  "TituloSite", "FotoDestaqueEmpreendimento", "VideoDestaque", "Mobiliado", "AreaConstruida"
];



const BASE_PARAMS_LISTING: VistaBaseParams = {
  key: process.env.VISTA_KEY!,
  showtotal: "1"
};

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
  ValorVenda?: string;
  ValorLocacao?: string;
  Dormitorios?: string;
  Suites?: string;
  Vagas?: string;
  AreaTotal?: string;
  AreaTerreno?: string;
  AreaConstruida?: string;
  DataHoraAtualizacao?: string;
  Lancamento?: string;
  Mobiliado?: string;
  Caracteristicas?: Record<string, any>;
  Foto?: Record<string, VistaPropertyDetailPhoto>;
  CodigoImobiliaria?: string; // ✨ Add CodigoImobiliaria to the interface to be safe
  [key: string]: any; // Permite outros campos dinâmicos da API Vista
}

const images = [
  {
    destaque: "true",
    codigo: "1",
    url: "https://www.template.leadlink.com.br/fotos/g/43e7430a8dcdbeb3d5045d8b27277c3416.webp?token=cEt6YmlubGFGVnM0Q1pIZVJlSjFOellIWkY3RGxzOFVOc1JIN1RWQXoyb0lwZFltN2xoVFlLbzJESThnQ3lxRDlxSFFzWjRDb2VTTmNmTStYZDhmRWc9PQ==",
    urlPequena: "https://www.template.leadlink.com.br/fotos/g/43e7430a8dcdbeb3d5045d8b27277c3416.webp?token=cEt6YmlubGFGVnM0Q1pIZVJlSjFOellIWkY3RGxzOFVOc1JIN1RWQXoyb0lwZFltN2xoVFlLbzJESThnQ3lxRDlxSFFzWjRDb2VTTmNmTStYZDhmRWc9PQ==",
},
{
    destaque: "true",
    codigo: "2",
    url: "https://www.template.leadlink.com.br/fotos/g/43e7430a8dcdbeb3d5045d8b27277c3416.webp?token=cEt6YmlubGFGVnM0Q1pIZVJlSjFOellIWkY3RGxzOFVOc1JIN1RWQXoyb0lwZFltN2xoVFlLbzJESThnQ3lxRDlxSFFzWjRDb2VTTmNmTStYZDhmRWc9PQ==",
    urlPequena: "https://www.template.leadlink.com.br/fotos/g/43e7430a8dcdbeb3d5045d8b27277c3416.webp?token=cEt6YmlubGFGVnM0Q1pIZVJlSjFOellIWkY3RGxzOFVOc1JIN1RWQXoyb0lwZFltN2xoVFlLbzJESThnQ3lxRDlxSFFzWjRDb2VTTmNmTStYZDhmRWc9PQ==",
},
{
    destaque: "true",
    codigo: "3",
    url: "https://www.template.leadlink.com.br/fotos/g/cc0a0ac29fd07a2201e7644af4a034b304.webp?token=cEt6YmlubGFGVnM0Q1pIZVJlSjFOellIWkY3RGxzOFVOc1JIN1RWQXoyb0lwZFltN2xoVFlLbzJESThnQ3lxRElUMUJEbEhMQUhNT0ZOL1J2Z2RFWHc9PQ==",
    urlPequena: "https://www.template.leadlink.com.br/fotos/g/cc0a0ac29fd07a2201e7644af4a034b304.webp?token=cEt6YmlubGFGVnM0Q1pIZVJlSjFOellIWkY3RGxzOFVOc1JIN1RWQXoyb0lwZFltN2xoVFlLbzJESThnQ3lxRElUMUJEbEhMQUhNT0ZOL1J2Z2RFWHc9PQ==",
},
{
    destaque: "true",
    codigo: "4",
    url: "https://www.template.leadlink.com.br/fotos/g/cc0a0ac29fd07a2201e7644af4a034b304.webp?token=cEt6YmlubGFGVnM0Q1pIZVJlSjFOellIWkY3RGxzOFVOc1JIN1RWQXoyb0lwZFltN2xoVFlLbzJESThnQ3lxRElUMUJEbEhMQUhNT0ZOL1J2Z2RFWHc9PQ==",
    urlPequena: "https://www.template.leadlink.com.br/fotos/g/cc0a0ac29fd07a2201e7644af4a034b304.webp?token=cEt6YmlubGFGVnM0Q1pIZVJlSjFOellIWkY3RGxzOFVOc1JIN1RWQXoyb0lwZFltN2xoVFlLbzJESThnQ3lxRElUMUJEbEhMQUhNT0ZOL1J2Z2RFWHc9PQ==",
},
{
    destaque: "true",
    codigo: "5",
    url: "https://www.template.leadlink.com.br/fotos/g/c250e9ccc5aa2599be4dbd5d396fc1ca09.webp?token=cEt6YmlubGFGVnM0Q1pIZVJlSjFOellIWkY3RGxzOFVOc1JIN1RWQXoyb0lwZFltN2xoVFlLbzJESThnQ3lxRHdEalhKNFhwNlFRdEVCTzVRS3FHalE9PQ==",
    urlPequena: "https://www.template.leadlink.com.br/fotos/g/c250e9ccc5aa2599be4dbd5d396fc1ca09.webp?token=cEt6YmlubGFGVnM0Q1pIZVJlSjFOellIWkY3RGxzOFVOc1JIN1RWQXoyb0lwZFltN2xoVFlLbzJESThnQ3lxRHdEalhKNFhwNlFRdEVCTzVRS3FHalE9PQ==",
},
{
    destaque: "true",
    codigo: "6",
    url: "https://www.template.leadlink.com.br/fotos/g/ac715d73262a8931c68643b20348e65a15.webp?token=cEt6YmlubGFGVnM0Q1pIZVJlSjFOellIWkY3RGxzOFVOc1JIN1RWQXoyb0lwZFltN2xoVFlLbzJESThnQ3lxRHc4ZllyQUpzSXAxZnJNSjd5Q1RRMHc9PQ==",
    urlPequena: "https://www.template.leadlink.com.br/fotos/g/ac715d73262a8931c68643b20348e65a15.webp?token=cEt6YmlubGFGVnM0Q1pIZVJlSjFOellIWkY3RGxzOFVOc1JIN1RWQXoyb0lwZFltN2xoVFlLbzJESThnQ3lxRHc4ZllyQUpzSXAxZnJNSjd5Q1RRMHc9PQ==",
},
{
    destaque: "true",
    codigo: "7",
    url: "https://www.template.leadlink.com.br/fotos/g/95b31c500c98126cd840b63c4c6d32da03.webp?token=cEt6YmlubGFGVnM0Q1pIZVJlSjFOellIWkY3RGxzOFVOc1JIN1RWQXoyb0lwZFltN2xoVFlLbzJESThnQ3lxRFlPTWRIYlZqVE5teWpBNXVHOUJMUXc9PQ==",
    urlPequena: "https://www.template.leadlink.com.br/fotos/g/95b31c500c98126cd840b63c4c6d32da03.webp?token=cEt6YmlubGFGVnM0Q1pIZVJlSjFOellIWkY3RGxzOFVOc1JIN1RWQXoyb0lwZFltN2xoVFlLbzJESThnQ3lxRFlPTWRIYlZqVE5teWpBNXVHOUJMUXc9PQ==",
},
{
    destaque: "true",
    codigo: "8",
    url: "https://www.template.leadlink.com.br/fotos/g/0f24a4ec171afffaa1241725079e81c611.webp?token=cEt6YmlubGFGVnM0Q1pIZVJlSjFOellIWkY3RGxzOFVOc1JIN1RWQXoyb0lwZFltN2xoVFlLbzJESThnQ3lxRHp5QXNQZWxkSnd2UkozWnUxRWFCREE9PQ==",
    urlPequena: "https://www.template.leadlink.com.br/fotos/g/0f24a4ec171afffaa1241725079e81c611.webp?token=cEt6YmlubGFGVnM0Q1pIZVJlSjFOellIWkY3RGxzOFVOc1JIN1RWQXoyb0lwZFltN2xoVFlLbzJESThnQ3lxRHp5QXNQZWxkSnd2UkozWnUxRWFCREE9PQ==",
},
{
    destaque: "true",
    codigo: "9",
    url: "https://www.template.leadlink.com.br/fotos/g/67cee18a300f0fb2b599a0826e4bef5e02.webp?token=cEt6YmlubGFGVnM0Q1pIZVJlSjFOellIWkY3RGxzOFVOc1JIN1RWQXoyb0lwZFltN2xoVFlLbzJESThnQ3lxRHk3N0JwbFFJWmdGWmJDc0pvVll6U0E9PQ==",
    urlPequena: "https://www.template.leadlink.com.br/fotos/g/67cee18a300f0fb2b599a0826e4bef5e02.webp?token=cEt6YmlubGFGVnM0Q1pIZVJlSjFOellIWkY3RGxzOFVOc1JIN1RWQXoyb0lwZFltN2xoVFlLbzJESThnQ3lxRHk3N0JwbFFJWmdGWmJDc0pvVll6U0E9PQ==",
},
{
    destaque: "true",
    codigo: "10",
    url: "https://www.template.leadlink.com.br/fotos/g/1d1f26f44e4a8ab1e800e40a01b575a614.webp?token=cEt6YmlubGFGVnM0Q1pIZVJlSjFOellIWkY3RGxzOFVOc1JIN1RWQXoyb0lwZFltN2xoVFlLbzJESThnQ3lxRFBZZ3p1bXVSOWJHSHNUTVMyN2FlSFE9PQ==",
    urlPequena: "https://www.template.leadlink.com.br/fotos/g/1d1f26f44e4a8ab1e800e40a01b575a614.webp?token=cEt6YmlubGFGVnM0Q1pIZVJlSjFOellIWkY3RGxzOFVOc1JIN1RWQXoyb0lwZFltN2xoVFlLbzJESThnQ3lxRFBZZ3p1bXVSOWJHSHNUTVMyN2FlSFE9PQ==",
},
{
    destaque: "true",
    codigo: "11",
    url: "https://www.template.leadlink.com.br/fotos/g/67cee18a300f0fb2b599a0826e4bef5e02.webp?token=cEt6YmlubGFGVnM0Q1pIZVJlSjFOellIWkY3RGxzOFVOc1JIN1RWQXoyb0lwZFltN2xoVFlLbzJESThnQ3lxRHk3N0JwbFFJWmdGWmJDc0pvVll6U0E9PQ==",
    urlPequena: "https://www.template.leadlink.com.br/fotos/g/67cee18a300f0fb2b599a0826e4bef5e02.webp?token=cEt6YmlubGFGVnM0Q1pIZVJlSjFOellIWkY3RGxzOFVOc1JIN1RWQXoyb0lwZFltN2xoVFlLbzJESThnQ3lxRHk3N0JwbFFJWmdGWmJDc0pvVll6U0E9PQ==",
},
{
    destaque: "true",
    codigo: "12",
    url: "https://www.template.leadlink.com.br/fotos/g/67cee18a300f0fb2b599a0826e4bef5e02.webp?token=cEt6YmlubGFGVnM0Q1pIZVJlSjFOellIWkY3RGxzOFVOc1JIN1RWQXoyb0lwZFltN2xoVFlLbzJESThnQ3lxRHk3N0JwbFFJWmdGWmJDc0pvVll6U0E9PQ==",
    urlPequena: "https://www.template.leadlink.com.br/fotos/g/67cee18a300f0fb2b599a0826e4bef5e02.webp?token=cEt6YmlubGFGVnM0Q1pIZVJlSjFOellIWkY3RGxzOFVOc1JIN1RWQXoyb0lwZFltN2xoVFlLbzJESThnQ3lxRHk3N0JwbFFJWmdGWmJDc0pvVll6U0E9PQ==",
},
{
    destaque: "true",
    codigo: "13",
    url: "https://www.template.leadlink.com.br/fotos/g/64be2d96a47ce7930d903538927540e912.webp?token=cEt6YmlubGFGVnM0Q1pIZVJlSjFOellIWkY3RGxzOFVOc1JIN1RWQXoyb0lwZFltN2xoVFlLbzJESThnQ3lxRHJ0aUdiSHhQTkJMN2lwRjBLYm1KK0E9PQ==",
    urlPequena: "https://www.template.leadlink.com.br/fotos/g/64be2d96a47ce7930d903538927540e912.webp?token=cEt6YmlubGFGVnM0Q1pIZVJlSjFOellIWkY3RGxzOFVOc1JIN1RWQXoyb0lwZFltN2xoVFlLbzJESThnQ3lxRHJ0aUdiSHhQTkJMN2lwRjBLYm1KK0E9PQ==",
},
{
    destaque: "true",
    codigo: "14",
    url: "https://www.template.leadlink.com.br/fotos/g/521d08720c218eef37a5a102b867fd7610.webp?token=cEt6YmlubGFGVnM0Q1pIZVJlSjFOellIWkY3RGxzOFVOc1JIN1RWQXoyb0lwZFltN2xoVFlLbzJESThnQ3lxRFZ3azZuK1N5Vi9udlUza3Z5RmZyR1E9PQ==",
    urlPequena: "https://www.template.leadlink.com.br/fotos/g/521d08720c218eef37a5a102b867fd7610.webp?token=cEt6YmlubGFGVnM0Q1pIZVJlSjFOellIWkY3RGxzOFVOc1JIN1RWQXoyb0lwZFltN2xoVFlLbzJESThnQ3lxRFZ3azZuK1N5Vi9udlUza3Z5RmZyR1E9PQ==",
},
{
    destaque: "true",
    codigo: "15",
    url: "https://www.template.leadlink.com.br/fotos/g/b3109116d5677067f340113d97e2ea2206.webp?token=cEt6YmlubGFGVnM0Q1pIZVJlSjFOellIWkY3RGxzOFVOc1JIN1RWQXoyb0lwZFltN2xoVFlLbzJESThnQ3lxRFFPT3hkczFVRnVrYjhYRWJ4cmNrVlE9PQ==",
    urlPequena: "https://www.template.leadlink.com.br/fotos/g/b3109116d5677067f340113d97e2ea2206.webp?token=cEt6YmlubGFGVnM0Q1pIZVJlSjFOellIWkY3RGxzOFVOc1JIN1RWQXoyb0lwZFltN2xoVFlLbzJESThnQ3lxRFFPT3hkczFVRnVrYjhYRWJ4cmNrVlE9PQ==",
},
{
    destaque: "true",
    codigo: "16",
    url: "https://www.template.leadlink.com.br/fotos/g/12b23ac519d4979587a2c988673f464807.webp?token=cEt6YmlubGFGVnM0Q1pIZVJlSjFOellIWkY3RGxzOFVOc1JIN1RWQXoyb0lwZFltN2xoVFlLbzJESThnQ3lxRFM5Qzg2emtTYk5HUklRWjR3QitSdHc9PQ==",
    urlPequena: "https://www.template.leadlink.com.br/fotos/g/12b23ac519d4979587a2c988673f464807.webp?token=cEt6YmlubGFGVnM0Q1pIZVJlSjFOellIWkY3RGxzOFVOc1JIN1RWQXoyb0lwZFltN2xoVFlLbzJESThnQ3lxRFM5Qzg2emtTYk5HUklRWjR3QitSdHc9PQ==",
},
{
    destaque: "true",
    codigo: "17",
    url: "https://www.template.leadlink.com.br/fotos/g/63aaf027a86ffde424918a637da73b3505.webp?token=cEt6YmlubGFGVnM0Q1pIZVJlSjFOellIWkY3RGxzOFVOc1JIN1RWQXoyb0lwZFltN2xoVFlLbzJESThnQ3lxRGxmek00dHdZU2NOV1hpREo0cHZpcFE9PQ==",
    urlPequena: "https://www.template.leadlink.com.br/fotos/g/63aaf027a86ffde424918a637da73b3505.webp?token=cEt6YmlubGFGVnM0Q1pIZVJlSjFOellIWkY3RGxzOFVOc1JIN1RWQXoyb0lwZFltN2xoVFlLbzJESThnQ3lxRGxmek00dHdZU2NOV1hpREo0cHZpcFE9PQ=="
},
]

// 🔄 Função utilitária para embaralhar
function shuffleArray<T>(array: T[]): T[] {
  return array
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
}

const processAndUpsertProperty = async (
  code: string,
  propertyData: VistaPropertyData
): Promise<void> => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { Caracteristicas, DataHoraAtualizacao, Cidade, CodigoImobiliaria, ...restOfProperty } = propertyData || {};

    const validDataHoraAtualizacao: string =
      DataHoraAtualizacao && !isNaN(Date.parse(DataHoraAtualizacao))
        ? new Date(DataHoraAtualizacao).toISOString()
        : new Date().toISOString();

    // 🚫 Ignora fotos da API
    const shuffledPhotos = shuffleArray(images);

    // 📌 Define a primeira como destaque (campo e relacionamento)
    const fotoDestaque = shuffledPhotos.length > 0 ? shuffledPhotos[0].url : null;

    // Todas as fotos continuam no relacionamento
    const photosToCreate: ImovelPhotoCreateInput[] = shuffledPhotos;

    const characteristicsToCreate: ImovelCaracteristicaCreateInput[] =
      Object.entries(Caracteristicas || {}).map(
        ([key, value]: [string, any]) => ({
          nome: key,
          valor: String(value),
        })
      );

    const parseToInt = (value: string | null | undefined): number | null => {
      if (!value || value.trim() === "") return null;
      const parsed = parseInt(value, 10);
      return isNaN(parsed) ? null : parsed;
    };

    const parseToFloat = (value: string | null | undefined): number | null => {
      if (!value || value.trim() === "") return 0;
      const parsed = parseFloat(value);
      return isNaN(parsed) ? null : parsed;
    };

    const valorVendaInt = parseToInt(restOfProperty.ValorVenda);
    const valorLocacaoInt = parseToInt(restOfProperty.ValorLocacao);
    const areaTotalFloat = parseToFloat(restOfProperty.AreaTotal);
    const areaTerrenoFloat = parseToFloat(restOfProperty.AreaTerreno);
    const areaConstruidaFloat = parseToFloat(restOfProperty.AreaConstruida);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { AreaTotal, AreaTerreno, AreaConstruida, ...rest } = restOfProperty;

    await prisma.imovel.upsert({
      where: { id: code },
      update: {
        ...rest,
        Cidade,
        ValorVenda: valorVendaInt,
        ValorLocacao: valorLocacaoInt,
        AreaTotal: areaTotalFloat,
        AreaTerreno: areaTerrenoFloat,
        AreaConstruida: areaConstruidaFloat,
        DataHoraAtualizacao: validDataHoraAtualizacao,
        FotoDestaque: fotoDestaque, // 👈 atualiza campo com a primeira foto
        fotos: {
          deleteMany: {},
          create: photosToCreate,
        },
        caracteristicas: {
          deleteMany: {},
          create: characteristicsToCreate,
        },
      },
      create: {
        id: code,
        ...rest,
        Cidade,
        ValorVenda: valorVendaInt,
        ValorLocacao: valorLocacaoInt,
        AreaTotal: areaTotalFloat,
        AreaTerreno: areaTerrenoFloat,
        AreaConstruida: areaConstruidaFloat,
        DataHoraAtualizacao: validDataHoraAtualizacao,
        FotoDestaque: fotoDestaque, // 👈 cria campo com a primeira foto
        fotos: {
          create: photosToCreate,
        },
        caracteristicas: {
          create: characteristicsToCreate,
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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const codigo = searchParams.get("codigo") || null;

    // --- Busca por código específico ---
    if (codigo) {
      const imovel = await prisma.imovel.findUnique({
        where: { id: codigo },
        include: {
          fotos: {
            select: {
              id: true,
              destaque: true,
              codigo: true,
              url: true,
              urlPequena: true,
            },
            orderBy: { id: "asc" },
          },
          caracteristicas: {
            select: { nome: true, valor: true },
          },
        },
      });

      if (imovel) {
        return NextResponse.json({
          currentPage: 1,
          pageSize: 1,
          totalPages: 1,
          totalItems: 1,
          imoveis: [imovel],
        });
      } else {
        return NextResponse.json(
          {
            currentPage: 1,
            pageSize: 0,
            totalPages: 0,
            totalItems: 0,
            imoveis: [],
          },
          { status: 404 }
        );
      }
    }

    // --- Params gerais ---
    const action = searchParams.get("action") ?? "comprar";
    const tipos = searchParams.get("tipos")?.split(",").filter(Boolean) || [];
    const bairros = searchParams.get("bairro")?.split(",").filter(Boolean) || [];
    const cidade = searchParams.get("cidade") ?? "porto alegre";
    const valorMin = Number(searchParams.get("valorMin")) || null;
    const valorMax = Number(searchParams.get("valorMax")) || null;
    const quartos = searchParams.get("quartos") || null;
    const suites = searchParams.get("suites") || null;
    const vagas = searchParams.get("vagas") || null;
    const caracteristicas = searchParams.get("caracteristicas")?.split(",").filter(Boolean) || [];
    const lancamentosFilterValue = parseSimNao(searchParams.get("lancamentos"));
    const mobiliadoFilterValue = parseSimNao(searchParams.get("mobiliado"));

    // --- Áreas ---
    const areaMin = Number(searchParams.get("areaMinima")) || null;
    const areaMax = Number(searchParams.get("areaMaxima")) || null;

    const sort = searchParams.get("sort") || "ImovelRecente";

    // --- Paginação ---
    const pageSize = Number(searchParams.get("pageSize")) || 12;
    const page = Number(searchParams.get("page")) || 1;
    const skip = (page - 1) * pageSize;

    // --- Campos dinâmicos ---
    const isAluguel = action.toLowerCase() === "alugar";
    const valorField = isAluguel ? "ValorLocacao" : "ValorVenda";

    // --- Filtros base ---
    const whereClause: any = {
      Status: isAluguel ? "Aluguel" : "Venda",
    };

    if (cidade) whereClause.Cidade = { equals: cidade, mode: "insensitive" };
    if (bairros.length > 0 && !(bairros.length === 1 && bairros[0].toLowerCase() === "all")) {
      whereClause.Bairro = { in: bairros, mode: "insensitive" };
    }
    if (tipos.length > 0) whereClause.Categoria = { in: tipos, mode: "insensitive" };
    if (quartos) whereClause.Dormitorios = { gte: String(quartos) };
    if (suites) whereClause.Suites = { gte: String(suites) };
    if (vagas) whereClause.Vagas = { gte: String(vagas) };
    if (lancamentosFilterValue !== null)
      whereClause.Lancamento = { equals: lancamentosFilterValue, mode: "insensitive" };
    if (mobiliadoFilterValue !== null)
      whereClause.Mobiliado = { equals: mobiliadoFilterValue, mode: "insensitive" };

    // --- Valor com margem de 5% ---
    if (valorMin !== null || valorMax !== null) {
      const min = valorMin ? valorMin * 0.95 : undefined;
      const max = valorMax ? valorMax * 1.05 : undefined;

      whereClause[valorField] = {
        ...(min !== undefined ? { gte: min } : {}),
        ...(max !== undefined ? { lte: max } : {}),
      };
    }

    // --- Área com margem de 5% ---
    if (areaMin !== null || areaMax !== null) {
      const min = areaMin ? areaMin * 0.95 : undefined;
      const max = areaMax ? areaMax * 1.05 : undefined;

      whereClause.OR = [
        {
          AreaTotal: {
            ...(min !== undefined ? { gte: min } : {}),
            ...(max !== undefined ? { lte: max } : {}),
          },
        },
        {
          AreaTerreno: {
            ...(min !== undefined ? { gte: min } : {}),
            ...(max !== undefined ? { lte: max } : {}),
          },
        },
        {
          AreaConstruida: {
            ...(min !== undefined ? { gte: min } : {}),
            ...(max !== undefined ? { lte: max } : {}),
          },
        },
      ];
    }

    // --- Características ---
    if (caracteristicas.length > 0) {
      whereClause.caracteristicas = {
        some: {
          AND: caracteristicas.map((carac) => ({
            nome: { equals: carac, mode: "insensitive" },
            valor: { equals: "sim", mode: "insensitive" },
          })),
        },
      };
    }

    whereClause.AND = [
      { OR: [{ [valorField]: { gt: 0 } }, { [valorField]: null }, { [valorField]: 0 }] },
    ];

    let sortByClause: any = {};
    switch (sort) {
      case "MaiorValor":

        sortByClause = [
          { [valorField]: { sort: "desc", nulls: "last" } },
          { DataHoraAtualizacao: "desc" },
        ];
        break;

      case "MenorValor":
        sortByClause = [
          { [valorField]: { sort: "asc", nulls: "last" } },
          { DataHoraAtualizacao: "desc" },
        ];
        break;

      case "ImovelRecente":
        sortByClause = [
          { DataHoraAtualizacao: "desc" },
        ];
        break;

      default:
        sortByClause = [
          { [valorField]: { sort: "asc", nulls: "last" } },
          { DataHoraAtualizacao: "desc" },
        ];
        break;
    }


    // --- Query ---
    const [imoveis, totalCount] = await prisma.$transaction([
      prisma.imovel.findMany({
        where: whereClause,
        orderBy: sortByClause,
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
            orderBy: { id: "asc" },
          },
          caracteristicas: {
            select: { nome: true, valor: true },
          },
        },
      }),
      prisma.imovel.count({ where: whereClause }),
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
    return NextResponse.json(
      { error: "Erro interno no servidor ao buscar imóveis" },
      { status: 500 }
    );
  }
}


function parseSimNao(value: string | null): "Sim" | "Nao" | null {
  if (!value) return null;
  const normalized = value.toLowerCase().trim();
  if (["sim", "s", "true"].includes(normalized)) return "Sim";
  if (["nao", "n", "false"].includes(normalized)) return "Nao";
  return null;
}

export async function PUT() {
  try {
    // 1. Fetch first page to determine total pages
    const firstPageUrl: string = buildListingsUrl(1);
    const firstPageData: VistaApiResponse = await fetchData<VistaApiResponse>(firstPageUrl);
    const totalPages: number = Number(firstPageData.paginas) || 1;

    let allProperties: Record<string, any> = extractProperties(firstPageData);

    // 2. Fetch remaining pages concurrently
    const pagePromises: Promise<Record<string, any>>[] = [];
    for (let page = 2; page <= totalPages; page++) {
      pagePromises.push(
        fetchData<VistaApiResponse>(buildListingsUrl(page))
          .then((data) => extractProperties(data))
          .catch((err) => {
            console.warn(`Falha ao buscar página ${page}: ${err.message}`);
            return {};
          })
      );
    }

    const results: Record<string, any>[] = await Promise.all(pagePromises);
    results.forEach((pageProperties) => {
      allProperties = { ...allProperties, ...pageProperties };
    });

    const apiIds = Object.keys(allProperties).map((id) => String(id));

    // 3. Get all existing IDs from database
    const existingImoveis = await prisma.imovel.findMany({ select: { id: true, DataHoraAtualizacao: true } });

    // 4. Concurrency limit
    const limit = pLimit(5);

    // 5. Add or update properties from API
    const upsertPromises = apiIds.map((code) =>
      limit(async () => {
        const property = allProperties[code];
        const existing = existingImoveis.find((i) => String(i.id) === String(code));

        const apiDate = property.DataHoraAtualizacao ? new Date(property.DataHoraAtualizacao).getTime() : 0;
        const dbDate = existing?.DataHoraAtualizacao ? new Date(existing.DataHoraAtualizacao).getTime() : 0;

        if (!existing || apiDate > dbDate) {
          await processAndUpsertProperty(code, property);
        }
      })
    );

    // 6. Delete properties not in API
    const deletePromises = existingImoveis
      .filter((i) => !apiIds.includes(String(i.id)))
      .map((i) =>
        limit(() => prisma.imovel.delete({ where: { id: i.id } }))
      );

    // 7. Wait for all operations
    const [upsertResults, deleteResults] = await Promise.all([
      Promise.allSettled(upsertPromises),
      Promise.allSettled(deletePromises),
    ]);

    return NextResponse.json({
      message: "Sincronização concluída.",
      addedOrUpdated: upsertResults.filter((r) => r.status === "fulfilled").length,
      deleted: deleteResults.filter((r) => r.status === "fulfilled").length,
      failedUpserts: upsertResults.filter((r) => r.status === "rejected").length,
      failedDeletes: deleteResults.filter((r) => r.status === "rejected").length,
    });
  } catch (error: any) {
    console.error("Erro ao sincronizar imóveis:", error.message);
    return NextResponse.json(
      { error: "Erro interno ao sincronizar imóveis" },
      { status: 500 }
    );
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