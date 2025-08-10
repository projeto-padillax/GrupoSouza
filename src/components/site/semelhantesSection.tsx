import Link from "next/link";
import { Destaque, ImovelCard } from "./imovelcard";

type ApiSemelhantes = {
    base?: {
        codigo: string;
        modalidade?: "aluguel" | "venda";
        priceField?: "ValorLocacao" | "ValorVenda";
        basePrice?: number;
    };
    semelhantes: Destaque[];
};

export default async function SemelhantesSection({ codigo }: { codigo: string }) {
    const res = await fetch(
        `http://localhost:3000/api/vista/imoveis/${codigo}/semelhante`,
        { cache: "no-store" }
    );

    if (!res.ok) return null;

    const data: ApiSemelhantes = await res.json();
    const itens = (data.semelhantes ?? []).slice(0, 4);

    if (!itens.length) return null;

    const activeTab = data.base?.modalidade === "aluguel" ? "Alugar" : "Comprar";

    return (
        <section className="mt-10">
            <h2 className="text-[#4d4d4d] text-xl font-bold mb-7">Imóveis semelhantes</h2>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {itens.map((imovel) => (
                    <Link
                        key={imovel.Codigo}
                        href={`/imovel/${encodeURIComponent(imovel.TituloSite || imovel.Descricao)}/${imovel.Codigo}`}
                        className="block"
                    >
                        <ImovelCard imovel={imovel} activeTab={activeTab} />
                    </Link>
                ))}
            </div>
        </section>
    );
}
