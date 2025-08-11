import ImoveisPage from "@/components/site/imoveisPage";
import { parseFiltros } from "@/utils/parseFilter";
import Header from "@/components/site/header";
import ClientLayout from "@/components/client-layout";
interface Props {
  params: Promise<{
    parametros?: string[];
  }>;
}

export default async function Imoveis({ params }: Props) {
  const filtros = (await params.then((p) => p.parametros)) ?? [];
  const parsedFiltros = parseFiltros(filtros);

  const query = new URLSearchParams();
  if (parsedFiltros.codigo) {
    query.set("codigo", parsedFiltros.codigo);
  } else {
    if (parsedFiltros.action) query.set("action", parsedFiltros.action);
    if (parsedFiltros.tipo?.length)
      query.set("tipos", parsedFiltros.tipo.join(","));
    if (parsedFiltros.bairro?.length)
      query.set("bairro", parsedFiltros.bairro.join(","));
    if (parsedFiltros.cidade) query.set("cidade", parsedFiltros.cidade);
    if (parsedFiltros.valorMin)
      query.set("valorMin", String(parsedFiltros.valorMin));
    if (parsedFiltros.valorMax)
      query.set("valorMax", String(parsedFiltros.valorMax));
    if (parsedFiltros.quartos)
      query.set("quartos", String(parsedFiltros.quartos));
    if (parsedFiltros.areaMinima)
      query.set("areaMinima", String(parsedFiltros.areaMinima));
    if (parsedFiltros.suites) query.set("suites", String(parsedFiltros.suites));
    if (parsedFiltros.vagas) query.set("vagas", String(parsedFiltros.vagas));
    if (parsedFiltros.caracteristicas?.length)
      query.set("caracteristicas", parsedFiltros.caracteristicas.join(","));
    if (parsedFiltros.lancamentos)
      query.set("lancamentos", parsedFiltros.lancamentos);
    if (parsedFiltros.mobiliado)
      query.set("mobiliado", parsedFiltros.mobiliado);
    if (parsedFiltros.sort)
      query.set("sort", parsedFiltros.sort);
  }

  const res = await fetch(
    `http://localhost:3000/api/vista/imoveis?${query.toString()}`
  );
  const data = await res.json();
  // console.log(parsedFiltros)
  return (
    <ClientLayout>
      <Header></Header>
      <ImoveisPage
        filtros={parsedFiltros}
        imoveis={data.imoveis}
        currentPage={data.currentPage}
        totalPages={data.totalPages}
        totalImoveis={data.total}
      />
    </ClientLayout>
  );
}
