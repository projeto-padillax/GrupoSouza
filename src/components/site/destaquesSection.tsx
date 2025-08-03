"use client"

import { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Heart } from "lucide-react";
import Image from "next/image";

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

     <div className="w-full flex flex-wrap justify-center gap-5 mb-10">
      <div className="w-full max-w-sm overflow-hidden rounded-xl shadow-md bg-white">
        <div className="relative w-full h-48">
          <Image
            src="https://res.cloudinary.com/duxuczb9e/image/upload/v1753828702/psj6udfomdwh99o5qyiv.jpg"
            alt="teste"
            fill
            className="object-cover rounded-t-xl"
          />
          <div className="absolute inset-0 bg-black/20" />
          <h3 className="absolute bottom-4 left-4 text-white text-xl font-bold">
            teste
          </h3>
        </div>

        <div className="p-5 flex flex-col gap-4">
          <div className="flex justify-between border-b border-gray-300 pb-2">
            <p className="text-sm text-gray-700">teste</p>
            <p className="text-sm text-gray-700">teste</p>
          </div>
          <div className="flex justify-between border-b border-gray-300 pb-2">
            <p className="text-sm text-gray-700">teste</p>
            <p className="text-sm text-gray-700">teste</p>
          </div>
          <div className="flex justify-between">
            <p className="text-sm text-gray-700">teste</p>
            <p className="text-sm text-gray-700">teste</p>
          </div>
        </div>
      </div>

      {/* Placeholder blue boxes */}
      <div className="bg-blue-500 w-full max-w-sm h-[100px] rounded-xl shadow" />
      <div className="bg-blue-500 w-full max-w-sm h-[100px] rounded-xl shadow" />
      <div className="bg-blue-500 w-full max-w-sm h-[100px] rounded-xl shadow" />
    </div>

      {/* Property Grid */}
      {/* <div className="w-full sm:w-1/2 lg:w-1/4 mb-3 px-2">
        {todosImoveis.map((imoveis) => (
          <Card
            key={imoveis.id}
            className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 w-full sm:w-1/2 lg:w-1/4 mb-3"
          >
            <div>
              <Image
                src={imoveis.FotoDestaque}
                alt={imoveis.Bairro}
                width={300}
                height={200}
                className="w-full h-48 object-cover relative"
              />
              <div className="relative inset-0 bg-black bg-opacity-20" />
              <h3 className="relative bottom-4 left-4 text-white text-xl font-bold">{imoveis.Bairro}</h3>
            </div>

            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{imoveis.Categoria}</p>
                  <p className="text-xs text-gray-500">#{imoveis.CodigoImobiliaria}</p>
                </div>
              </div>

              <div className="space-y-1 mb-4">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>{imoveis.AreaTotal}</span>
                  {imoveis.Dormitorios && <span>{imoveis.Dormitorios}</span>}
                  {imoveis.Vagas && <span>{imoveis.Vagas}</span>}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <Button variant="ghost" size="sm" className="p-1 h-auto">
                  <Heart className="w-5 h-5 text-blue-600" />
                </Button>
                <span className="text-lg font-bold text-gray-800">{imoveis.ValorLocacao}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div> */}
    </section>
  );
}