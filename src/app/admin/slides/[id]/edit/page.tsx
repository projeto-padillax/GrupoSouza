import { notFound } from "next/navigation";
import SlideForm from "@/components/admin/slideForm";
import { findSlide } from "@/lib/actions/slide";

interface EditSlidePageProps {
    params: Promise<{ id: string }>;
}

export default async function EditSlidePage({ params }: EditSlidePageProps) {
    const slideId = await params.then(p => parseInt(p.id));
    console.log(slideId)
    if (isNaN(slideId)) {
        notFound();
    }

    try {
        const slide = await findSlide(slideId);
        console.log( slide) 
        if (!slide) {
            notFound();
        }

        return <SlideForm slide={slide} mode="edit" />;
    } catch (error) {
        console.error("Erro ao carregar slide:", error);
        notFound();
    }
}