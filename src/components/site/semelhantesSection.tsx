import Link from "next/link";
import { ImovelCard } from "./imovelcard";
import { Destaque } from "@/lib/types/destaque";

type ApiSemelhantes = {
    base?: {
        codigo: string;
        modalidade?: "aluguel" | "venda";
        priceField?: "ValorLocacao" | "ValorVenda";
        basePrice?: number;
    };
    semelhantes: Destaque[];
};

function toSlug(text: string): string {
    return text
      .normalize("NFD") // separa acentos das letras
      .replace(/[\u0300-\u036f]/g, "") // remove acentos
      .replace(/[^a-zA-Z0-9\s-]/g, "") // remove caracteres especiais
      .trim() // remove espaços extras do começo/fim
      .replace(/\s+/g, "-") // troca espaços por -
      .replace(/-+/g, "-") // evita múltiplos hífens
      .toLowerCase();
  }

export default async function SemelhantesSection({ codigo }: { codigo: string }) {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/vista/imoveis/${codigo}/semelhante`,
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
                        href={`/imovel/${encodeURIComponent(toSlug(imovel.TituloSite) || toSlug(imovel.Descricao))}/${imovel.Codigo}`}
                        className="block"
                    >
                        <ImovelCard imovel={imovel} activeTab={activeTab} />
                    </Link>
                ))}
            </div>
        </section>
    );
}
