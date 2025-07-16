import { notFound } from "next/navigation";
import { findChamada } from "@/lib/actions/chamada";
import ChamadaForm from "@/components/admin/chamadaForm";

interface EditChamadasPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditChamadasPage({ params }: EditChamadasPageProps) {
    const chamadaId = await params.then(p => parseInt(p.id));
    console.log(chamadaId)
    if (isNaN(chamadaId)) {
        notFound();
    }

    try {
        const chamada = await findChamada(chamadaId);
        console.log( chamada) 
        if (!chamada) {
            notFound();
        }

        return <ChamadaForm chamada={chamada} mode="edit" />;
    } catch (error) {
        console.error("Erro ao carregar chamada:", error);
        notFound();
    }
}