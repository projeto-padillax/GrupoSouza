// app/busca/page.tsx (sem a pasta "[...parametros]")

import ImoveisPage from "@/components/site/imoveisPage";
import Header from "@/components/site/header";
import ClientLayout from "@/components/client-layout";
import Footer from "@/components/site/footer";
import { Filtros, parseFiltroURL } from "@/utils/parseFilter";

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

export default async function Imoveis({ searchParams }: Props) {
  // Use await para garantir que os searchParams estejam prontos
  const awaitedSearchParams = await searchParams;
  
  const parseFiltroCidade = parseFiltroURL(awaitedSearchParams.cidade || "Piracicaba:all");
  const [cidade, bairros] = parseFiltroCidade.split(":");
  const initialFiltros: Filtros = {
    action: awaitedSearchParams.action ?? "comprar",
    tipo: awaitedSearchParams.tipos ? awaitedSearchParams.tipos.split("_") : [],
    cidade: awaitedSearchParams.cidade || "",
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
