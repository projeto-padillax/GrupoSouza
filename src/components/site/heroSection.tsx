"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

interface HeroSectionProps {
  imageUrl: string;
  titulo: string;
  subtitulo: string;
  url: string;
}

export function HeroSection( banner : HeroSectionProps) {

  return (
    <section className="relative h-[90vh] w-full bg-cover bg-center bg-repeat" style={{background: `linear-gradient(90deg, rgba(0,0,0,0.938813025210084) 0%, rgba(0,0,0,0) 100%),url(${banner.imageUrl})`}}>
      {/* <div className="absolute inset-0 bg-black bg-opacity-40"></div> */}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-semibold text-white mb-4 leading-tight">
            {banner.titulo}
          </h1>
          <p className="text-xl text-white mb-[160px]">{banner.subtitulo}</p>

          {/* Search tabs */}
          <div className="flex gap-4 mb-6">
            <button className="px-4 py-2 bg-white text-gray-900 rounded-t-lg text-sm font-medium">Link opcional</button>
            <button className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-t-lg text-sm">link opcional</button>
            <button className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-t-lg text-sm">link opcional</button>
          </div>

          {/* Search form */}
          <div className="bg-white rounded-lg p-4 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Comprar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="comprar">Comprar</SelectItem>
                  <SelectItem value="alugar">Alugar</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartamento">Apartamento</SelectItem>
                  <SelectItem value="casa">Casa</SelectItem>
                  <SelectItem value="terreno">Terreno</SelectItem>
                </SelectContent>
              </Select>

              <Input placeholder="Localização" />
              <Input placeholder="Valor" />
            </div>

            <div className="flex justify-between items-center mt-4">
              <div className="flex gap-4 text-sm">
                <button className="text-blue-600 hover:underline">Busca avançada</button>
                <button className="text-blue-600 hover:underline">Buscar por código</button>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
