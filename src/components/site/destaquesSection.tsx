"use client";

import { useEffect, useState } from "react";
import { ImovelCard } from "./imovelcard";
import Link from "next/link";
import { Destaque } from "@/lib/types/destaque";

interface DestaquesSectionProps {
  destaques: {
    lancamentos: Destaque[];
    venda: Destaque[];
    aluguel: Destaque[];
  };
}

export function DestaquesSection({ destaques }: DestaquesSectionProps) {
  const [activeTab, setActiveTab] = useState<string>("Alugar");
  const [todosImoveis, setTodosImoveis] = useState<Destaque[]>([
    ...destaques.lancamentos,
    ...destaques.venda,
    ...destaques.aluguel,
  ]);

  useEffect(() => {
    switch (activeTab) {
      case "Alugar":
        setTodosImoveis(destaques.aluguel);
        break;
      case "Comprar":
        setTodosImoveis(destaques.venda);
        break;
      case "Lançamentos":
        setTodosImoveis(destaques.lancamentos);
        break;
      default:
        setTodosImoveis([]);
    }
  }, [activeTab, destaques]);

  return (
    <section className="py-8 justify-items-center">
      <div className="px-8 sm:px-10 md:px-12 w-full max-w-7xl">
        <div className="w-full mt-3 mb-12 flex flex-col md:flex-row items-center justify-center md:gap-[35px] text-center">
          <h2 className="text-[min(max(2rem,4vw),4rem)] font-semibold text-[#333] mb-2 md:mb-0">
            Destaques
          </h2>

          <div className="flex justify-center items-center gap-4 md:pl-[35px] md:border-l border-[#d0d0d0] text-[1.2rem] py-2">
            {["Alugar", "Comprar", "Lançamentos"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
          py-1 border-b-4 inline-block
          transition-colors duration-300 ease-in-out
          cursor-pointer
          ${activeTab === tab ? "border-[#0084d7]" : "border-transparent"}
          hover:border-[#005a9e"]
        `}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center gap-5 mb-10">
          {todosImoveis.map((imovel: Destaque) => (
            <Link
              key={imovel.id}
              href={`/imovel/${encodeURIComponent(
                imovel.TituloSite || imovel.Descricao
              )}/${imovel.Codigo}`}
            >
              <ImovelCard
                key={imovel.id}
                imovel={imovel}
                activeTab={activeTab}
              ></ImovelCard>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
