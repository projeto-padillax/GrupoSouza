import SecaoForm from "@/components/admin/secaoForm";
import { Secao } from "@/lib/types/secao";
import { secoes } from "@/lib/utils";
import { notFound } from "next/navigation";

interface EditSecoesPage {
    params: Promise<{ id: string }>;
}

export default async function EditSecoesPage({
  params,
}: EditSecoesPage) {
  const secoesId = (await params).id;

  const secao: Secao | undefined = secoes.find((secao) => secao.id == parseInt(secoesId));

  if (!secao) {
    return notFound();
  }

  return <SecaoForm secao={secao} mode="edit"/>;
}