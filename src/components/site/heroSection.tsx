"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, DollarSign, Home, MapPin, Search } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { LocationSelectModal } from "@/components/site/locationSelectModal";
import { TypeSelectModal } from "@/components/site/tipoImovelSelectModal";
import { useState } from "react";
import { ValueRangeModal } from "./valueRangeModal";

interface HeroSectionProps {
  imageUrl: string;
  titulo: string;
  subtitulo: string;
  url: string;
}

export function HeroSection(banner: HeroSectionProps) {
  const [searchData, setSearchData] = useState({
    action: "",
    tipos: [] as string[],
    locations: [] as string[],
    valueRange: { min: "", max: "" },
  });

  const [modals, setModals] = useState({
    location: false,
    type: false,
    value: false,
  });

  const openModal = (modalType: "location" | "type" | "value") => {
    setModals({ ...modals, [modalType]: true });
  };

  const closeModal = (modalType: "location" | "type" | "value") => {
    setModals({ ...modals, [modalType]: false });
  };

  const getLocationDisplayText = () => {
    if (searchData.locations.length === 0) return "Localização";
    if (searchData.locations.length === 1) {
      const location = searchData.locations[0];
      if (location.includes(":")) {
        const [, bairro] = location.split(":");
        return bairro;
      }
      return location;
    }
    return `${searchData.locations.length} localizações`;
  };

  const getTypeDisplayText = () => {
    if (searchData.tipos.length === 0) return "Tipo";
    if (searchData.tipos.length === 1) {
      // Mapear IDs para labels amigáveis
      const typeLabels: { [key: string]: string } = {
        apartamentos: "Apartamentos",
        "areas-empresariais": "Áreas Empresariais",
        chacaras: "Chácaras",
        "condominios-fechados": "Condomínios Fechados",
        "loteamentos-condominios": "Loteamentos em Condomínios",
        residencias: "Residências",
        "residencias-predios-comerciais": "Residências/Prédios Comerciais",
        sitios: "Sítios",
        barracoes: "Barracões",
        comerciais: "Comerciais",
        estacionamentos: "Estacionamentos",
        "galpoes-areas-empresariais": "Galpões e Áreas Empresariais",
        "pontos-comerciais": "Pontos Comerciais",
        "predios-comerciais": "Prédios Comerciais",
        "salas-comerciais": "Salas Comerciais",
        saloes: "Salões",
        terrenos: "Terrenos",
        "vagas-garagem": "Vagas de Garagem",
      };
      return typeLabels[searchData.tipos[0]] || searchData.tipos[0];
    }
    return `${searchData.tipos.length} tipos`;
  };

  const handleSearch = () => {
    console.log("Dados de busca:", searchData);
  };

  return (
    <section
      className="relative h-[90vh] w-full bg-cover bg-center"
      style={{
        background: `linear-gradient(90deg, rgba(0,0,0,0.938813025210084) 0%, rgba(0,0,0,0) 100%),url(${banner.imageUrl})`,
      }}
    >
      {/* <div className="absolute inset-0 bg-black bg-opacity-40"></div> */}

      <div className="relative z-10 md:w-[80%] lg:w-full h-full flex flex-col justify-center">
        <div className="mx-auto w-[90%] max-w-7xl sm:px-10">
          <Link
            href={banner.url}
            className="text-4xl md:text-5xl font-semibold text-white mb-4 leading-tight "
          >
            {banner.titulo}
          </Link>
          <p className="text-xl text-white mb-[160px]">{banner.subtitulo}</p>

          {/* Search tabs */}
          <div className="flex gap-8 mb-6">
            <Link
              href="#"
              className="pt-2 text-white bg-transparent text-[20px] font-extralight font-[Montserrat, sans-serif] hover:font-semibold hover:border-b-white hover:border-b-2"
            >
              Lançamentos
            </Link>
            <Link
              href="#"
              className="py-2 bg-transparent text-white text-[20px] font-extralight font-[Montserrat, sans-serif] hover:font-semibold hover:border-b-white hover:border-b-2"
            >
              Portugal
            </Link>
            <Link
              href="#"
              className="py-2 bg-transparent text-white text-[20px] font-extralight font-[Montserrat, sans-serif] hover:font-semibold hover:border-b-white hover:border-b-2"
            >
              Litoral
            </Link>
          </div>

          {/* Search form */}
          <div className="bg-white rounded-lg p-4 shadow-lg w-full lg:max-w-3xl opacity-95">
            <Tabs defaultValue="avancada" className="gap-6">
              <TabsList>
                <TabsTrigger value="avancada">Busca Avançada</TabsTrigger>
                <TabsTrigger value="codigo">Busca por Códgio</TabsTrigger>
              </TabsList>
              <TabsContent value="avancada">
                <div className="flex flex-col lg:flex-row w-full justify-between items-center">
                  <div className="flex flex-col gap-y-4 lg:gap-y-0 lg:flex-row lg:gap-x-4 lg:w-auto w-full">
                    <Select
                      value={searchData.action}
                      onValueChange={(value) =>
                        setSearchData({ ...searchData, action: value })
                      }
                    >
                      <SelectTrigger className="lg:data-[size=default]:h-12 w-full">
                        <SelectValue placeholder="Comprar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="comprar">Comprar</SelectItem>
                        <SelectItem value="alugar">Alugar</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="outline"
                      onClick={() => openModal("type")}
                      className="justify-between bg-transparent font-normal lg:h-12"
                    >
                      <div className="flex items-center gap-2">
                        <Home className="h-4 w-4 text-gray-500" />
                        <span
                          className={
                            searchData.tipos.length === 0
                              ? "text-gray-500"
                              : "text-gray-900"
                          }
                        >
                          {getTypeDisplayText()}
                        </span>
                      </div>
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    </Button>

                    {/* Localização - Modal Select */}
                    <Button
                      variant="outline"
                      onClick={() => openModal("location")}
                      className="justify-between bg-transparent font-normal lg:h-12"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span
                          className={
                            searchData.locations.length === 0
                              ? "text-gray-500"
                              : "text-gray-900"
                          }
                        >
                          {getLocationDisplayText()}
                        </span>
                      </div>
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => openModal("value")}
                      className="justify-between h-12 bg-transparent font-normal"
                    >
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        <span
                          className={
                            !searchData.valueRange.min &&
                            !searchData.valueRange.max
                              ? "text-gray-500"
                              : "text-gray-900"
                          }
                        >
                          Valor
                        </span>
                      </div>
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    </Button>
                  </div>
                  <Button
                    onClick={handleSearch}
                    className="bg-[#001c40] hover:bg-[#0084d7] hover:cursor-pointer w-36 h-12 lg:w-12 lg:mt-0 mt-4"
                  >
                    <Search className="h-6 w-6" />
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="codigo">
                <div className="flex justify-between items-center">
                  <Input
                    placeholder="Código do Imóvel"
                    className="max-w-5xl w-[70%] md:w-[90%] h-12"
                  />
                  <Button
                    onClick={handleSearch}
                    className="bg-[#001c40] hover:bg-[#0084d7] hover:cursor-pointer h-12 w-12"
                  >
                    <Search className="h-6 w-6" />
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      {/* Modals */}
      <LocationSelectModal
        isOpen={modals.location}
        onClose={() => closeModal("location")}
        selectedLocations={searchData.locations}
        onSelectionChange={(locations) =>
          setSearchData({ ...searchData, locations })
        }
      />

      <TypeSelectModal
        isOpen={modals.type}
        onClose={() => closeModal("type")}
        selectedTypes={searchData.tipos}
        onSelectionChange={(tipos) => setSearchData({ ...searchData, tipos })}
      />

      <ValueRangeModal
        isOpen={modals.value}
        onClose={() => closeModal("value")}
        selectedRange={searchData.valueRange}
        onRangeChange={(valueRange) =>
          setSearchData({ ...searchData, valueRange })
        }
      />
    </section>
  );
}
