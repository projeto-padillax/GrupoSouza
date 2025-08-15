"use client";

import { useFavoriteStore } from "@/lib/stores/useFavoriteStore";
import { Destaque } from "@/lib/types/destaque";
import Link from "next/link";
import { ImovelCard } from "./imovelcard";

export default function FavoritesList() {
  const favoritos = useFavoriteStore((state) => state.favorites);

  const comprar = favoritos.filter((favorito) => favorito.Status === "VENDA");
  const alugar = favoritos.filter((favorito) => favorito.Status === "ALUGUEL");

  if (favoritos.length === 0) {
    return (
      <p className="text-center text-gray-500 col-span-full py-8">
        Nenhum imóvel favoritado.
      </p>
    );
  }

  return (
    // Removidas as classes de padding: px-4 sm:px-6 lg:px-8
    // O container pai em Favoritos.tsx já define a largura e o padding externo.
    <div className="w-full py-8 space-y-10">
      {comprar.length > 0 && (
        <section>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#333] mb-6">
            Imóveis Favoritos para Comprar
          </h2>
          {/* Removido max-w-screen-xl mx-auto daqui */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {comprar.map((favorito: Destaque) => (
              <Link
                key={favorito.id}
                href={`/imovel/${encodeURIComponent(
                  favorito.TituloSite || favorito.Descricao
                )}/${favorito.Codigo}`}
              >
                <ImovelCard
                  imovel={favorito}
                  activeTab="comprar"
                />
              </Link>
            ))}
          </div>
        </section>
      )}

      {alugar.length > 0 && (
        <section>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#333] mb-6">
            Imóveis Favoritos para Alugar
          </h2>
          {/* Removido max-w-screen-xl mx-auto daqui */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {alugar.map((favorito: Destaque) => (
              <Link
                key={favorito.id}
                href={`/imovel/${encodeURIComponent(
                  favorito.TituloSite || favorito.Descricao
                )}/${favorito.Codigo}`}
              >
                <ImovelCard
                  imovel={favorito}
                  activeTab="alugar"
                />
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}