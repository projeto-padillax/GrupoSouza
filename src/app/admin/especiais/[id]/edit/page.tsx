import { notFound } from "next/navigation";
import { findEspecial } from "@/lib/actions/especiais";
import { getCorretoresAtivosParaSelect } from "@/lib/actions/corretores";
import EspecialForm from "@/components/admin/especialForm";

export default async function EditEspecialPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const especial = await findEspecial(id);

  if (!especial) return notFound();

  const corretores = await getCorretoresAtivosParaSelect();

  return <EspecialForm especial={especial} corretores={corretores} />;
}
