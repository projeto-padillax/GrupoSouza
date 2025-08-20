import SecaoForm from "@/components/admin/secaoForm";
import { notFound } from "next/navigation";

interface EditSecoesPage {
    params: Promise<{ id: string }>;
}

export default async function EditSecoesPage({
  params,
}: EditSecoesPage) {
    const secoes = [
    {
        id: "1",
        titulo: "Página Inicial",
        url: "https://www.template.leadlink.com.br/",
        edicao: "Não",
        sitemap: "Sim",
    },
];
  const secoesId = (await params).id;

  const secao = secoes.filter((secao) => secao.id == secoesId);

  if (!secao) {
    return notFound();
  }

  return <SecaoForm secao={secao} />;
}