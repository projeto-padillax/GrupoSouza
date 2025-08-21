// app/busca/page.tsx (sem a pasta "[...parametros]")

import ImoveisPage from "@/components/site/imoveisPage";
import Header from "@/components/site/header";
import ClientLayout from "@/components/client-layout";
import Footer from "@/components/site/footer";
import { Filtros } from "@/utils/parseFilter";
import { capitalize } from "@/lib/utils";

interface Props {
  searchParams: Promise<{
    action?: string;
    tipos?: string;
    cidade?: string;
    bairro?: string;
    valorMin?: string;
    valorMax?: string;
    quartos?: string;
    areaMinima?: string;
    suites?: string;
    vagas?: string;
    caracteristicas?: string;
    lancamentos?: string;
    mobiliado?: string;
    codigo?: string;
    page?: string;
    sort?: string;
  }>;
}

const buildUrl = (filtros: Filtros) => {
  let titulo = "";

  const tipoPrincipal = (filtros.tipo || []).length > 0
  ? capitalize(filtros.tipo![0])
  : "Imóveis";

  titulo += filtros.action === "comprar"
    ? `${tipoPrincipal} à venda`
    : `${tipoPrincipal} para alugar`;

  if (filtros.quartos) titulo += `, com ${filtros.quartos}+ quarto${filtros.quartos !== "1" ? "s" : ""}`;
  if (filtros.suites) titulo += `, com ${filtros.suites}+ suíte${filtros.suites !== "1" ? "s" : ""}`;
  if (filtros.vagas) titulo += `, com ${filtros.vagas}+ vaga${filtros.vagas !== "1" ? "s" : ""}`;
  if (filtros.areaMinima) titulo += `, com área mínima de ${filtros.areaMinima}m²`;
  if ((filtros.caracteristicas || []).length > 0) titulo += `, com ${filtros.caracteristicas!.join(", ")}`;
  if (filtros.lancamentos === "s") titulo += `, lançamento`;
  if (filtros.mobiliado === "sim") titulo += `, mobiliado`;

  if (
      filtros.bairro &&
      (filtros.bairro[0]?.split(",").length > 1)
    ) {
      titulo += ` em alguns bairros`;
    }
    // Localizações
    if (filtros.cidade) {
      titulo += ` em ${filtros.cidade}`;
      if (filtros.bairro && filtros.bairro[0]?.split(",").length === 1) {
        titulo += ` no bairro ${filtros.bairro[0]}`;
      }
    }

  return titulo;
};

// Função do Next.js para gerar metadata dinamicamente
export async function generateMetadata({ searchParams }: Props) {
  const awaitedSearchParams = await searchParams;

  const filtros: Filtros = {
    action: awaitedSearchParams.action ?? "comprar",
    tipo: awaitedSearchParams.tipos ? awaitedSearchParams.tipos.split("_") : [],
    cidade: awaitedSearchParams.cidade || "Piracicaba",
    bairro: awaitedSearchParams.bairro?.split("_") || [],
    valorMin: awaitedSearchParams.valorMin || "",
    valorMax: awaitedSearchParams.valorMax || "",
    quartos: awaitedSearchParams.quartos || "",
    areaMinima: awaitedSearchParams.areaMinima || "",
    suites: awaitedSearchParams.suites || "",
    vagas: awaitedSearchParams.vagas || "",
    caracteristicas: awaitedSearchParams.caracteristicas
      ? awaitedSearchParams.caracteristicas.split("_")
      : [],
    lancamentos: awaitedSearchParams.lancamentos || "",
    mobiliado: awaitedSearchParams.mobiliado || "",
    codigo: awaitedSearchParams.codigo || "",
    page: awaitedSearchParams.page || "1",
    sort: awaitedSearchParams.sort || "",
  };

  const titulo = buildUrl(filtros);

  return {
    title: titulo + " | LeadLink",
    description: `Lista de ${titulo}. Descubra milhares de ofertas com preços imperdíveis. Confira já!`,
  };
}

export default async function Imoveis({ searchParams }: Props) {
  // Use await para garantir que os searchParams estejam prontos
  const awaitedSearchParams = await searchParams;
  
  const initialFiltros: Filtros = {
    action: awaitedSearchParams.action ?? "comprar",
    tipo: awaitedSearchParams.tipos ? awaitedSearchParams.tipos.split("_") : [],
    cidade: awaitedSearchParams.cidade || "Piracicaba",
    bairro: awaitedSearchParams.bairro?.split("_") || [],
    valorMin: awaitedSearchParams.valorMin || "",
    valorMax: awaitedSearchParams.valorMax || "",
    quartos: awaitedSearchParams.quartos || "",
    areaMinima: awaitedSearchParams.areaMinima || "",
    suites: awaitedSearchParams.suites || "",
    vagas: awaitedSearchParams.vagas || "",
    caracteristicas: awaitedSearchParams.caracteristicas
      ? awaitedSearchParams.caracteristicas.split("_")
      : [],
    lancamentos: awaitedSearchParams.lancamentos || "",
    mobiliado: awaitedSearchParams.mobiliado || "",
    codigo: awaitedSearchParams.codigo || "",
    page: awaitedSearchParams.page || "1",
    sort: awaitedSearchParams.sort || "",
  };

  return (
    <ClientLayout>
      <Header />
      <ImoveisPage filtros={initialFiltros}/>
      <Footer />
    </ClientLayout>
  );
}
