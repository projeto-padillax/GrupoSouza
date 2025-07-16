import { notFound } from "next/navigation";
import { findCorretor } from "@/lib/actions/corretores";
import CorretorForm from "@/components/admin/corretorForm";

export default async function EditCorretorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const corretor = await findCorretor(id);

  if (!corretor) return notFound();

  return (
    <div className="py-12">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">Editar Corretor</h1>
            <p className="text-lg text-gray-600">Edite o corretor selecionado</p>
          </div>
        </div>

        <CorretorForm corretor={corretor} />
      </div>
    </div>
  );
}