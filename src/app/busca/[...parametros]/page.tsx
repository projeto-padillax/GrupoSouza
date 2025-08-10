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
  // console.log(parsedFiltros)
  return (
    <ClientLayout>
      <Header></Header>
      <ImoveisPage filtros={parsedFiltros} />
    </ClientLayout>
  );
}
