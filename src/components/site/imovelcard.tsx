import Image from "next/image";
import FavoriteButton from "./favoritosButton";
import { CodigoImobiliariaIcon } from "../ui/codigoImobiliariaIcon";
import { Destaque } from "@/lib/types/destaque";

interface PropertyCardProps {
  imovel: Destaque
  activeTab: string
}

export function ImovelCard({ imovel, activeTab }: PropertyCardProps) {
  const capitalizeCategory = (category: string) => {
    return category
      .toLowerCase()
      .split('/')
      .map(part =>
        part
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      )
      .join('/')
  }

  // Verifica se há pelo menos uma informação de detalhe para mostrar
  const areas = [imovel.AreaTotal, imovel.AreaPrivativa, imovel.AreaTerreno];
  const area = areas.find(a => Number(a) > 0);

  const hasDormitorios = Number(imovel.Dormitorios) > 0
  const hasVagas = Number(imovel.Vagas) > 0
  const hasAnyDetail = area || hasDormitorios || hasVagas

  const formatPrice = () => {
    const isRent = activeTab === "Alugar";
    // Value is already a number or null/undefined, no need for string manipulation
    const value = isRent ? imovel.ValorLocacao : imovel.ValorVenda;

    if (value === null || value === undefined || value === 0) {
      return "Consulte";
    }

    // Format the numeric value as Brazilian currency
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="w-full overflow-hidden shadow-lg bg-white rounded-md">
      <div className="relative w-full h-48">
        <Image
          src={imovel.FotoDestaque || "/placeholder.svg"}
          alt={imovel.Bairro}
          fill
          className="object-cover rounded-t-xl rounded-b-xl"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent rounded-t-xl rounded-b-xl" />
        <div className="absolute inset-0 shadow-inner rounded-t-xl rounded-b-xl" />
        <h3 className="absolute bottom-4 left-0 w-full text-center text-white text-xl font-bold px-4">
          {imovel.Bairro}
        </h3>
      </div>

      <div className="p-5 flex flex-col h-[180px]">
        {/* Categoria e Código */}
        <div className={`flex justify-between items-center mb-4 ${hasAnyDetail ? 'border-b border-gray-200 pb-3' : ''}`}>
          <p className="text-sm text-gray-600 font-medium">
            {capitalizeCategory(imovel.Categoria)}
          </p>
          <p className="text-sm text-gray-600 flex items-center gap-1">
            <CodigoImobiliariaIcon className="w-3 h-3 text-gray-400" />
            {imovel.Codigo}
          </p>
        </div>

        {/* Detalhes do imóvel - sempre ocupa espaço, mas só mostra conteúdo se houver */}
        <div className="flex-1 flex items-center justify-center mb-4">
          {hasAnyDetail ? (
            <div className="flex justify-between items-center w-full border-b border-gray-200 pb-3">
              {area && (
  <p className="text-sm text-gray-600">
    {area}m²
  </p>
)}
              {hasDormitorios && (
                <p className="text-sm text-gray-600">
                  {imovel.Dormitorios} quarto{Number(imovel.Dormitorios) > 1 ? "s" : ""}
                </p>
              )}
              {hasVagas && (
                <p className="text-sm text-gray-600">
                  {imovel.Vagas} vaga{Number(imovel.Vagas) > 1 ? "s" : ""}
                </p>
              )}
            </div>
          ) : (
            // Espaço vazio sem nenhuma linha ou borda
            <div className="w-full"></div>
          )}
        </div>

        {/* Favoritos e Preço - sempre na parte inferior */}
        <div className="flex justify-between items-center mt-auto">
          <FavoriteButton propertyId={`imovel-${imovel.id}`} />
          <p className="text-lg text-gray-800">
            {formatPrice()}
          </p>
        </div>
      </div>
    </div>
  )
}