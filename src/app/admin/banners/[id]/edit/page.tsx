import { notFound } from "next/navigation";
import { findBanner } from "@/lib/actions/banner";
import BannerForm from "@/components/admin/bannerForm";

interface EditBannerPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditBannerPage({ params }: EditBannerPageProps) {
    const bannerId = await params.then(p => parseInt(p.id));
    if (isNaN(bannerId)) {
        notFound();
    }

    try {
        const banner = await findBanner(bannerId);
        if (!banner) {
            notFound();
        }

        return <BannerForm banner={banner} mode="edit" />;
    } catch (error) {
        console.error("Erro ao carregar banner:", error);
        notFound();
    }
}