"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";

export default function ImoveisList() {
  const searchParams = useSearchParams();
  const query = searchParams.toString();

  const { data, isLoading } = useSWR(`/api/imoveis?${query}`, fetch);

  if (isLoading) return <p>Carregando...</p>;
  return (
    <div className="w-full py-4">
      {/* <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 justify-center gap-5">
        {imoveis.length === 0 && (
          <p className="text-center text-gray-500 col-span-full">
            Nenhum imóvel encontrado com os filtros selecionados.
          </p>
        )}

        {imoveis &&
          imoveis.map((imovel: Destaque) => (
            <Link
              key={imovel.id}
              href={`/imovel/${encodeURIComponent(
                imovel.TituloSite || imovel.Descricao
              )}/${imovel.Codigo}`}
            >
              <ImovelCard
                key={imovel.id}
                imovel={imovel}
                activeTab={searchData.action}
              ></ImovelCard>
            </Link>
          ))}
      </div> */}
    </div>
  );
}
