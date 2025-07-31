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
    <section className="200px background-color=red">
      <div className="w-full mt-3 mb-5 flex flex-wrap items-center justify-center gap-[35px]">
        <h2 className="text-[48px] font-semibold text-[#333] mb-5"> Destaques </h2>
        <div className="flex justify-center items-center gap-10 pl-[35px] border-l border-[#d0d0d0] text-[1.2rem] py-2 font-light">
          {["Alugar", "Comprar", "Lançamentos"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                                py-1 px-3 border-b-4
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

      {/* Property Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {todosImoveis.map((imoveis) => (
          <Card
            key={imoveis.id}
            className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div>
              <Image
                src={imoveis.FotoDestaque}
                alt={imoveis.Bairro}
                width={300}
                height={200}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20" />
              <h3 className="absolute bottom-4 left-4 text-white text-xl font-bold">{imoveis.Bairro}</h3>
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
      </div>
    </section>
  );
}