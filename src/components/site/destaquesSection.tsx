"use client"

import { useEffect, useState } from "react";

import { ImovelCard } from "./imovelcard";

export interface Destaque {
  id: string;
  AreaTotal: string;
  Bairro: string;
  Categoria: string;
  CodigoImobiliaria: string;
  Dormitorios: string;
  FotoDestaque: string;
  Lancamento: string;
  Status: string;
  Vagas: string;
  ValorLocacao: string;
  ValorVenda: string;
  Codigo: string;
}

interface DestaquesSectionProps {
  destaques: {
    lancamentos: Destaque[];
    venda: Destaque[];
    aluguel: Destaque[];
  };
}

export function DestaquesSection({ destaques }: DestaquesSectionProps) {
  const [activeTab, setActiveTab] = useState<string>("Alugar");
  const [todosImoveis, setTodosImoveis] = useState<Destaque[]>(
    [...destaques.lancamentos, ...destaques.venda, ...destaques.aluguel]
  );

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
    <section className="w-[90%] mx-auto max-w-7xl">
      <div className="w-full mt-3 mb-5 flex flex-wrap items-center justify-center gap-[35px]">
        <h2 className="text-[min(max(2rem,4vw),4rem)] font-semibold text-[#333] mb-5"> Destaques </h2>
        <div className="flex justify-center items-center gap-4 pl-[35px] border-l border-[#d0d0d0] text-[1.2rem] py-2">
          {["Alugar", "Comprar", "Lançamentos"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                py-1 border-b-4 inline-block
                transition-colors duration-300 ease-in-out
                cursor-pointer
                ${activeTab === tab ? "border-[#0084d7]" : "border-transparent"}
                hover:border-[#005a9e]
              `}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full flex justify-center gap-5 mb-10">
        {todosImoveis.map((imovel: Destaque) => (
          <ImovelCard key={imovel.id} imovel={imovel} activeTab={activeTab}></ImovelCard>
        ))}
      </div>
    </section>
  );
}