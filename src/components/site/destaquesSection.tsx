"use client"

import { useEffect, useState } from "react";
import Image from "next/image";
import FavoriteButton from "./favoritosButton";
import { CodigoImobiliariaIcon } from "../ui/codigoImobiliariaIcon";

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
}

interface DestaquesSectionProps {
  destaques: Destaque[]
}

export function DestaquesSection({ destaques }: DestaquesSectionProps) {
  const [activeTab, setActiveTab] = useState<string>("Alugar")
  const [todosImoveis, setTodosImoveis] = useState(destaques)

  useEffect(() => {
    let filtrados: Destaque[] = [];

    if (activeTab === "Alugar") {
      filtrados = destaques.filter((d) => d.Status === "ALUGUEL");
    } else if (activeTab === "Comprar") {
      filtrados = destaques.filter((d) => d.Status === "VENDA");
    } else if (activeTab === "Lançamentos") {
      filtrados = destaques.filter((d) => d.Lancamento === "Sim");
    }

    setTodosImoveis(filtrados.slice(0, 4));
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

      <div className="w-full flex  justify-center gap-5 mb-10">
        {todosImoveis.map((imovel: Destaque) => (
          <div
            key={imovel.id}
            className="w-full max-w-xs overflow-hidden rounded-xl shadow-md bg-white"
          >
            <div className="relative w-full h-48">
              <Image
                src={imovel.FotoDestaque}
                alt={imovel.Bairro}
                fill
                className="object-cover rounded-t-xl"
              />
              <div className="absolute inset-0 bg-black/20" />
              <h3 className="absolute bottom-4 left-0 w-full text-center text-white text-xl font-bold px-2">
                {imovel.Bairro}
              </h3>
            </div>

            <div className="p-5 flex flex-col gap-4">
              <div className="flex justify-between border-b border-gray-300 pb-2">
                <p className="text-sm text-gray-700">{imovel.Categoria.toLocaleLowerCase()}</p>
                <p className="text-sm text-gray-700 flex items-center gap-1">
                  <CodigoImobiliariaIcon className="w-3 h-3 text-gray-400" />
                  {imovel.CodigoImobiliaria}
                </p>
              </div>
              <div className="flex justify-between border-b border-gray-300 pb-2">
                <p className="text-sm text-gray-700">{imovel.AreaTotal}m²</p>
                <p className="text-sm text-gray-700">{imovel.Dormitorios} quartos </p>
                <p className="text-sm text-gray-700">{imovel.Vagas} vagas </p>
              </div>
              <div className="flex justify-between">
                <FavoriteButton propertyId={`imovel-${imovel.id}`} />
                <p className="text-sm text-gray-700 font-bold">
                  R${(imovel.ValorVenda !== "0" ? imovel.ValorVenda : imovel.ValorLocacao)}
                </p>
              </div>

            </div>
          </div>
        ))}
      </div>
    </section>
  );
}