import { notFound } from "next/navigation";
import { findBanner } from "@/lib/actions/banner";
import BannerForm from "@/components/admin/bannerForm";

export default async function EditBannerPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const banner = await findBanner(parseInt(id));

  if (!banner) return notFound();

  return (
    <div className="py-12">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">Editar Banner na Home</h1>
            <p className="text-lg text-gray-600">Edite o banner selecionado</p>
          </div>
        </div>

        <BannerForm banner={banner} />
      </div>
    </div>
  );
}
