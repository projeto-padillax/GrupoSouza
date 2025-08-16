"use client";
import { Filtros } from "@/utils/parseFilter";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ChevronDown, Filter, Search } from "lucide-react";
import { LocationSelectModal } from "./locationSelectModal";
import { TypeSelectModal } from "./tipoImovelSelectModal";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { ImovelCard } from "./imovelcard";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Destaque } from "@/lib/types/destaque";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import BreadCrumb from "./filteredBreadcrumb";
import { ImovelCardSkeleton } from "./cardSkeleton";

export default function ImoveisPage({ filtros }: { filtros: Filtros }) {
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(filtros.page ?? 1);
  const [imoveis, setImoveis] = useState<Destaque[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalImoveis, setTotalImoveis] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState(filtros.sort);
  const [titulo, setTitulo] = useState("");
  const location =
    filtros.bairro?.map((i) => `${filtros.cidade}:${i.replaceAll("-", " ")}`) ??
    [];
  const [searchData, setSearchData] = useState({
    action: filtros.action ?? "comprar",
    tipos: filtros.tipo
      ? filtros.tipo.map((t: string) => decodeURIComponent(t))
      : ([] as string[]),
    locations: location,
    cidade: filtros.cidade ?? "Piracicaba",
    bairro: filtros.bairro ?? (["all"] as string[]),
    valueRange: { min: filtros.valorMin ?? "", max: filtros.valorMax ?? "" },
    quartos: filtros.quartos ?? "",
    area: filtros.areaMinima ?? "",
    suites: filtros.suites ?? "",
    vagas: filtros.vagas ?? "",
    caracteristicas: filtros.caracteristicas ?? ([] as string[]),
    lancamentos: filtros.lancamentos ?? "",
    mobiliado: filtros.mobiliado ?? "",
  });
  const [codigo, setCodigo] = useState(filtros.codigo ?? "");
  const [modals, setModals] = useState({
    location: false,
    type: false,
  });

  const caracteristicas = [
    { id: "academia", label: "Academia" },
    { id: "elevador", label: "Elevador" },
    { id: "piscina", label: "Piscina" },
    { id: "playground", label: "Playground" },
    { id: "portaria", label: "Portaira" },
    { id: "quadra", label: "Quadra de esportes" },
    { id: "sacada", label: "Sacada" },
    { id: "saloa", label: "Salão de festa" },
  ];

  useEffect(() => {
    const newSearchParams = new URLSearchParams();

    if (searchData.action) newSearchParams.set("action", searchData.action);
    if (searchData.tipos?.length > 0)
      newSearchParams.set("tipos", searchData.tipos.join(","));
    if (searchData.locations.length > 0) {
      newSearchParams.set("cidade", searchData.locations[0].split(":")[0]);
      newSearchParams.set(
        "bairro",
        searchData.locations.map((i) => i.split(":")[1]).join(",")
      );
    }
    if (searchData.valueRange.min)
      newSearchParams.set("valorMin", searchData.valueRange.min);
    if (searchData.valueRange.max)
      newSearchParams.set("valorMax", searchData.valueRange.max);
    if (searchData.quartos !== "")
      newSearchParams.set("quartos", searchData.quartos);
    if (searchData.area !== "")
      newSearchParams.set("areaMinima", searchData.area);
    if (searchData.suites !== "")
      newSearchParams.set("suites", searchData.suites);
    if (searchData.vagas !== "") newSearchParams.set("vagas", searchData.vagas);
    if (searchData.caracteristicas?.length > 0)
      newSearchParams.set(
        "caracteristicas",
        searchData.caracteristicas.join(",")
      );
    if (searchData.lancamentos != "")
      newSearchParams.set("lancamentos", searchData.lancamentos);
    if (searchData.mobiliado != "")
      newSearchParams.set("mobiliado", searchData.mobiliado);
    if (codigo) newSearchParams.set("codigo", codigo);
    // ... e os outros filtros
    if (sortOrder) newSearchParams.set("sort", sortOrder);
    newSearchParams.set("page", String(page));
    // 2. Atualizar a URL do navegador
    router.push(`?${decodeURIComponent(newSearchParams.toString())}`, {
      scroll: false,
    });
    console.log(newSearchParams.toString());
    // 3. Buscar os dados da API
    const fetchImoveis = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/vista/imoveis?${newSearchParams.toString()}`
        );
        const data = await res.json();
        setImoveis(data.imoveis);
        setTotalPages(data.totalPages);
        setTotalImoveis(data.totalItems);
        gerarTitulo(data.totalItems);
        // ... (atualize totalPages e totalImoveis)
      } catch (error) {
        console.error("Falha ao buscar imóveis:", error);
        setImoveis([]);
      } finally {
        setLoading(false);
      }
    };

    fetchImoveis();
  }, [searchData, sortOrder, page, router]);

  function gerarTitulo(totalImoveis: number) {
    if (totalImoveis === 0) {
      setTitulo("");
    }

    let titulo = `${totalImoveis} `;

    // Tipo de ação
    titulo +=
      searchData.action === "comprar"
        ? "imóveis à venda"
        : "imóveis para alugar";

    // Tipos de imóvel
    // if (searchData.tipos.length > 0) {
    //   titulo += ` (${searchData.tipos.join(", ")})`;
    // }

    // Quartos
    if (searchData.quartos !== "") {
      titulo += `, com ${searchData.quartos}+ quarto${
        searchData.quartos !== "1" ? "s" : ""
      }`;
    }

    // Suítes
    if (searchData.suites !== "") {
      titulo += `, com ${searchData.suites}+ suíte${
        searchData.suites !== "1" ? "s" : ""
      }`;
    }

    // Vagas
    if (searchData.vagas !== "") {
      titulo += `, com ${searchData.vagas}+ vaga${
        searchData.vagas !== "1" ? "s" : ""
      }`;
    }

    // Área mínima
    if (searchData.area !== "") {
      titulo += `, com área mínima de ${searchData.area}m²`;
    }

    // Características
    if (searchData.caracteristicas.length > 0) {
      titulo += `, com ${searchData.caracteristicas.join(", ")}`;
    }

    // Lançamentos
    if (searchData.lancamentos === "s") {
      titulo += `, lançamento`;
    }

    // Mobiliado
    if (searchData.mobiliado === "sim") {
      titulo += `, mobiliado`;
    }

    if (
      filtros.bairro &&
      (filtros.bairro.length > 1 || filtros.bairro[0] === "all")
    ) {
      titulo += ` em alguns bairros`;
    }
    // Localizações
    if (filtros.cidade) {
      titulo += ` de ${filtros.cidade}`;
      if (filtros.bairro?.length === 1 && filtros.bairro[0] !== "all") {
        titulo += ` no bairro ${filtros.bairro[0]}`;
      }
    }

    if (codigo) {
      titulo += ` com código ${codigo}`;
    }

    // Faixa de preço
    const min = searchData.valueRange.min;
    const max = searchData.valueRange.max;
    if (min || max) {
      if (min && max) {
        titulo += `, entre R$ ${Number(min).toLocaleString()} e R$ ${Number(
          max
        ).toLocaleString()}`;
      } else if (min) {
        titulo += `, a partir de R$ ${Number(min).toLocaleString()}`;
      } else if (max) {
        titulo += `, até R$ ${Number(max).toLocaleString()}`;
      }
    }

    setTitulo(titulo);
  }

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

  const openModal = (modalType: "location" | "type") => {
    setModals({ ...modals, [modalType]: true });
  };

  const closeModal = (modalType: "location" | "type") => {
    setModals({ ...modals, [modalType]: false });
  };

  const handleSearchByCode = async (code: string) => {
    if (!code) return;
    router.push(`/busca?codigo=${code}`, {
      scroll: false,
    });
    setLoading(true);
    try {
      const res = await fetch(`/api/vista/imoveis?codigo=${code}`);
      const data = await res.json();
      setImoveis(data.imoveis);
      setTotalPages(data.totalPages);
      setTotalImoveis(data.totalItems);
      gerarTitulo(data.totalItems);
      // ... (atualize totalPages e totalImoveis)
    } catch (error) {
      console.error("Falha ao buscar imóveis:", error);
      setImoveis([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="w-full content-center shadow-lg shadow-gray-200">
        <div className="bg-white w-[full] max-w-7xl px-4 mx-auto py-4 border-t-2 ">
          <div className="flex flex-col md:flex-row w-[full] justify-start items-center md:gap-2">
            <div className=" flex flex-row justify-between flex-wrap items-center gap-y-4 w-full">
              <Select
                value={searchData.action}
                onValueChange={(value) =>
                  setSearchData({ ...searchData, action: value })
                }
              >
                <SelectTrigger className="lg:data-[size=default]:h-12 px-0 w-full sm:w-fit border-0 shadow-none cursor-pointer">
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
                className="justify-between bg-transparent has-[>svg]:px-0 font-normal w-full sm:w-fit lg:h-12 border-0 shadow-none cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span>
                    Tipo
                    {searchData.tipos.length > 0
                      ? `(${searchData.tipos.length})`
                      : ""}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </Button>

              {/* Localização - Modal Select */}
              <Button
                variant="outline"
                onClick={() => openModal("location")}
                className="justify-between bg-transparent has-[>svg]:px-0 font-normal w-full sm:w-fit lg:h-12 border-0 shadow-none cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span>
                    Localização
                    {searchData.locations.length > 0
                      ? `(${searchData.locations.length})`
                      : ""}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </Button>

              <Select
                value={searchData.valueRange.min}
                onValueChange={(value) =>
                  setSearchData({
                    ...searchData,
                    valueRange: { ...searchData.valueRange, min: value },
                  })
                }
              >
                <SelectTrigger className="lg:data-[size=default]:h-12 has-[>svg]:px-0 w-full sm:w-fit border-0 shadow-none cursor-pointer text-blac">
                  <SelectValue placeholder="Valor de" className="text-black" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">R$ 0</SelectItem>
                  <SelectItem value="50000">R$ 50 mil</SelectItem>
                  <SelectItem value="100000">R$ 100 mil</SelectItem>
                  <SelectItem value="200000">R$ 200 mil</SelectItem>
                  <SelectItem value="500000">R$ 500 mil</SelectItem>
                  <SelectItem value="1000000">R$ 1 milhão</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={searchData.valueRange.max}
                onValueChange={(value) =>
                  setSearchData({
                    ...searchData,
                    valueRange: { ...searchData.valueRange, max: value },
                  })
                }
              >
                <SelectTrigger className="lg:data-[size=default]:h-12 w-full has-[>svg]:px-0 sm:w-fit border-0 shadow-none cursor-pointer">
                  <SelectValue placeholder="Valor até" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="100000">R$ 100 mil</SelectItem>
                  <SelectItem value="200000">R$ 200 mil</SelectItem>
                  <SelectItem value="500000">R$ 500 mil</SelectItem>
                  <SelectItem value="1000000">R$ 1 milhão</SelectItem>
                  <SelectItem value="2000000">R$ 2 milhões</SelectItem>
                  <SelectItem value="999999999">Sem limite</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-4 w-full sm:w-fit h-9 lg:h-12 justify-between">
                <span className="text-sm">Quartos</span>
                <div className="flex items-center gap-2">
                  {[1, 2, 3].map((num) => (
                    <button
                      key={num}
                      onClick={() =>
                        setSearchData({
                          ...searchData,
                          quartos: num.toString(),
                        })
                      }
                      className={`w-[30px] h-[30px] border border-gray-300 rounded-[4px] cursor-pointer ${
                        searchData.quartos === num.toString()
                          ? "bg-[#4F7DC3] text-white font-bold"
                          : "bg-white text-black font-normal"
                      }  hover:bg-[#4F7DC3] hover:text-white hover:font-bold`}
                    >
                      {num}+
                    </button>
                  ))}
                </div>
              </div>
              {/* Botão Filtros */}
              <Button
                variant="outline"
                className="bg-transparent border font-normal has-[>svg]:pr-2 pl-3 pr-1.5 w-full sm:w-fit lg:h-12 lg:w-24 justify-between shadow-none cursor-pointer"
                onClick={() => setShowFilters(!showFilters)}
              >
                Filtros
                <Filter className="h-4 w-4 text-gray-500 mr-1" />
              </Button>

              {/* Busca por código */}
              <div className="flex items-center border rounded-lg overflow-hidden w-full sm:w-fit h-9 lg:h-12">
                <Input
                  placeholder="Código"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  className="placeholder:text-black border-0 text-sm focus:ring-0 focus:outline-none focus-visible:ring-0 shadow-none text-black"
                />
                <Button
                  onClick={() => handleSearchByCode(codigo)}
                  className="bg-transparent rounded-none h-full cursor-pointer hover:bg-[#4F7DC3] text-gray-500 hover:text-white"
                >
                  <Search className="h-4 w-4 text-current" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`bg-white max-w-7xl mx-auto px-4 overflow-hidden border-t-2 transition-all duration-500 ease-in-out ${
            showFilters ? "opacity-100 max-h-96 py-4" : "opacity-0 max-h-0 py-0"
          }`}
        >
          <div className="flex flex-col md:flex-row w-[full] justify-start items-center md:gap-2">
            <div className=" flex flex-col gap-y-4 w-full sm:grid sm:grid-cols-2 md:grid md:grid-cols-3 lg:grid lg:auto-cols-auto lg:grid-flow-col lg:grid-cols-none lg:gap-x-1">
              <Select
                value={searchData.area}
                onValueChange={(value) =>
                  setSearchData({ ...searchData, area: value })
                }
              >
                <SelectTrigger className="data-[size=default]:h-12 p-0 border-0 shadow-none cursor-pointer w-full sm:w-fit">
                  <SelectValue placeholder="Area Mínima" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Area Minima</SelectItem>
                  <SelectItem value="100">100m²</SelectItem>
                  <SelectItem value="150">150m²</SelectItem>
                  <SelectItem value="200">200m²</SelectItem>
                  <SelectItem value="250">250m²</SelectItem>
                  <SelectItem value="300">300m²</SelectItem>
                  <SelectItem value="350">350m²</SelectItem>
                  <SelectItem value="400">400m²</SelectItem>
                  <SelectItem value="450">450m²</SelectItem>
                  <SelectItem value="500">500m²</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-4 h-12 w-full sm:w-fit justify-between text-sm">
                <span>Suítes</span>
                <div className="flex items-center gap-2">
                  {[1, 2, 3].map((num) => (
                    <button
                      key={num}
                      onClick={() =>
                        setSearchData({ ...searchData, suites: num.toString() })
                      }
                      className={`w-[30px] h-[30px] border border-gray-300 rounded-[4px] cursor-pointer ${
                        searchData.suites === num.toString()
                          ? "bg-[#4F7DC3] text-white font-bold"
                          : "bg-white text-black font-normal"
                      }  hover:bg-[#4F7DC3] hover:text-white hover:font-bold`}
                    >
                      {num}+
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 h-12 w-full sm:w-fit">
                <span className="text-sm">Vagas</span>
                <div className="flex items-center gap-2">
                  {[1, 2, 3].map((num) => (
                    <button
                      key={num}
                      onClick={() =>
                        setSearchData({ ...searchData, vagas: num.toString() })
                      }
                      className={`w-[30px] h-[30px] border border-gray-300 rounded-[4px] cursor-pointer ${
                        searchData.vagas === num.toString()
                          ? "bg-[#4F7DC3] text-white font-bold"
                          : "bg-white text-black font-normal"
                      }  hover:bg-[#4F7DC3] hover:text-white hover:font-bold`}
                    >
                      {num}+
                    </button>
                  ))}
                </div>
              </div>

              <Popover>
                <PopoverTrigger className="cursor-pointer h-12 w-full sm:w-fit text-start text-sm">
                  Caracteristicas
                </PopoverTrigger>
                <PopoverContent className="cursor-pointer">
                  {caracteristicas.map((type) => (
                    <div
                      key={type.id}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors border-0 shadow-none ${
                        searchData.caracteristicas.includes(type.id)
                          ? " border shadow-sm"
                          : "hover:bg-gray-50 border border-transparent"
                      }`}
                      onClick={() => {
                        setSearchData((prev) => ({
                          ...prev,
                          caracteristicas: prev.caracteristicas.includes(
                            type.id
                          )
                            ? prev.caracteristicas.filter(
                                (id) => id !== type.id
                              )
                            : [...prev.caracteristicas, type.id],
                        }));
                      }}
                    >
                      <Checkbox
                        checked={searchData.caracteristicas.includes(type.id)}
                        onCheckedChange={(checked) => {
                          setSearchData((prev) => ({
                            ...prev,
                            caracteristicas: checked
                              ? prev.caracteristicas.filter(
                                  (id) => id !== type.id
                                )
                              : [...prev.caracteristicas, type.id],
                          }));
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className="text-sm font-medium text-gray-900">
                        {type.label}
                      </span>
                    </div>
                  ))}
                </PopoverContent>
              </Popover>
              <div className="flex items-center space-x-2 h-12 w-full sm:w-fit justify-between">
                <Label htmlFor="lancamentos">Lançamentos</Label>
                <Switch
                  checked={
                    searchData.lancamentos == ""
                      ? false
                      : searchData.lancamentos === "s"
                  }
                  onCheckedChange={(checked) =>
                    setSearchData({
                      ...searchData,
                      lancamentos: checked ? "s" : "",
                    })
                  }
                />
              </div>
              <div className="flex items-center space-x-2 w-full h-12 sm:w-fit justify-between">
                <Label htmlFor="mobiliado">Mobiliado</Label>
                <Switch
                  checked={
                    searchData.mobiliado == ""
                      ? false
                      : searchData.mobiliado === "sim"
                  }
                  onCheckedChange={(checked) =>
                    setSearchData({
                      ...searchData,
                      mobiliado: checked ? "sim" : "",
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <main className="flex-1 pb-8">
        <div className="w-full py-4">
          <div className="max-w-7xl mx-auto px-4">
            <div className="h-6 rounded-sm select-none mt-3">
              <BreadCrumb />
            </div>
          </div>
        </div>
        <div className="w-full py-4">
          <div className="max-w-7xl mx-auto px-4 mt-2 mb-3 flex items-center justify-between">
            <div className="h-auto min-h-6 rounded-sm">
              <h1 className="text-2xl font-bold text-[#4d4d4d]">{titulo}</h1>
            </div>
            <div>
              <Select
                value={sortOrder}
                onValueChange={(value) => setSortOrder(value)}
              >
                <SelectTrigger className="lg:data-[size=default]:h-12 w-full has-[>svg]:px-3 sm:w-fit border-0 shadow-none cursor-pointer">
                  <SelectValue placeholder={"Filtro"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ImovelRecente">Mais recentes</SelectItem>
                  <SelectItem value="MenorValor">Menor valor</SelectItem>
                  <SelectItem value="MaiorValor">Maior valor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="w-full py-4">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center gap-5">
            {loading ? (
              // Se estiver carregando, mostre os skeletons
              Array.from({ length: 8 }).map((_, index) => (
                <ImovelCardSkeleton key={index} />
              ))
            ) : imoveis.length === 0 ? (
              // Se não estiver carregando, mas não houver imóveis, mostre a mensagem de "não encontrado"
              <p className="text-center text-gray-500 col-span-full">
                Nenhum imóvel encontrado com os filtros selecionados.
              </p>
            ) : (
              // Caso contrário, mostre os imóveis
              imoveis.map((imovel: Destaque) => (
                <Link
                  key={imovel.id}
                  href={`/imovel/${encodeURIComponent(
                    toSlug(imovel.TituloSite) || toSlug(imovel.Descricao)
                  )}/${imovel.Codigo}`}
                >
                  <ImovelCard imovel={imovel} activeTab={searchData.action} />
                </Link>
              ))
            )}
          </div>
          <div className="max-w-7xl mx-auto px-4 mt-10">
            {totalImoveis > 0 && (
              <Pagination>
                <PaginationContent>
                  {/* Botão Anterior */}
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage(Number(page) - 1)}
                      className={
                        page === 1
                          ? "pointer-events-none opacity-50 cursor-none"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {(() => {
                    const maxVisible = 5; // máximo de páginas visíveis
                    let startPage = Math.max(
                      1,
                      Number(page) - Math.floor(maxVisible / 2)
                    );
                    let endPage = startPage + maxVisible - 1;

                    if (endPage > (totalPages || 1)) {
                      endPage = totalPages || 1;
                      startPage = Math.max(1, endPage - maxVisible + 1);
                    }

                    const pages = [];
                    for (let i = startPage; i <= endPage; i++) {
                      pages.push(
                        <PaginationItem key={i}>
                          <PaginationLink
                            className="cursor-pointer"
                            isActive={page === i}
                            onClick={() => setPage(i)}
                          >
                            {i}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                    return pages;
                  })()}

                  {/* Botão Próximo */}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setPage(Number(page) + 1)}
                      className={
                        page === totalPages
                          ? "pointer-events-none opacity-50 cursor-none"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </div>
      </main>
      <LocationSelectModal
        isOpen={modals.location}
        onClose={() => closeModal("location")}
        selectedLocations={searchData.locations}
        onSelectionChange={(location) =>
          setSearchData({ ...searchData, locations: location })
        }
      />

      <TypeSelectModal
        isOpen={modals.type}
        onClose={() => closeModal("type")}
        selectedTypes={searchData.tipos}
        onSelectionChange={(tipos) => setSearchData({ ...searchData, tipos })}
      />
    </div>
  );
}
