"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, MapPin, X } from "lucide-react"

interface LocationOption {
  id: string
  cidade: string
  estado: string
  bairros: string[]
}

interface LocationSelectModalProps {
  isOpen: boolean
  onClose: () => void
  selectedLocations: string[]
  onSelectionChange: (locations: string[]) => void
}

export function LocationSelectModal({
  isOpen,
  onClose,
  selectedLocations,
  onSelectionChange,
}: LocationSelectModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedCities, setExpandedCities] = useState<string[]>([])

  // Dados mockados de localização - em produção viriam do Firestore
  const locationOptions: LocationOption[] = [
    {
      id: "sao-paulo",
      cidade: "São Paulo",
      estado: "SP",
      bairros: [
        "Vila Madalena",
        "Pinheiros",
        "Itaim Bibi",
        "Moema",
        "Vila Olímpia",
        "Brooklin",
        "Campo Belo",
        "Santo Amaro",
        "Morumbi",
        "Jardins",
        "Consolação",
        "Liberdade",
        "Bela Vista",
        "República",
        "Centro",
      ],
    },
    {
      id: "rio-de-janeiro",
      cidade: "Rio de Janeiro",
      estado: "RJ",
      bairros: [
        "Copacabana",
        "Ipanema",
        "Leblon",
        "Barra da Tijuca",
        "Botafogo",
        "Flamengo",
        "Lagoa",
        "Tijuca",
        "Vila Isabel",
        "Maracanã",
        "Centro",
        "Santa Teresa",
        "Lapa",
      ],
    },
    {
      id: "belo-horizonte",
      cidade: "Belo Horizonte",
      estado: "MG",
      bairros: [
        "Savassi",
        "Funcionários",
        "Lourdes",
        "Belvedere",
        "Buritis",
        "Pampulha",
        "Centro",
        "Santa Efigênia",
        "Cidade Nova",
        "São Pedro",
        "Mangabeiras",
        "Serra",
      ],
    },
    {
      id: "brasilia",
      cidade: "Brasília",
      estado: "DF",
      bairros: [
        "Asa Sul",
        "Asa Norte",
        "Lago Sul",
        "Lago Norte",
        "Sudoeste",
        "Noroeste",
        "Águas Claras",
        "Taguatinga",
        "Ceilândia",
        "Samambaia",
        "Planaltina",
        "Sobradinho",
      ],
    },
    {
      id: "salvador",
      cidade: "Salvador",
      estado: "BA",
      bairros: [
        "Barra",
        "Ondina",
        "Rio Vermelho",
        "Pituba",
        "Itaigara",
        "Caminho das Árvores",
        "Graça",
        "Vitória",
        "Campo Grande",
        "Pelourinho",
        "Centro",
        "Federação",
      ],
    },
  ]

  const filteredLocations = locationOptions.filter(
    (location) =>
      location.cidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.estado.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.bairros.some((bairro) => bairro.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const toggleCity = (cityId: string) => {
    if (expandedCities.includes(cityId)) {
      setExpandedCities(expandedCities.filter((id) => id !== cityId))
    } else {
      setExpandedCities([...expandedCities, cityId])
    }
  }

  const handleLocationChange = (locationKey: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedLocations, locationKey])
    } else {
      onSelectionChange(selectedLocations.filter((loc) => loc !== locationKey))
    }
  }

  const removeLocation = (locationKey: string) => {
    onSelectionChange(selectedLocations.filter((loc) => loc !== locationKey))
  }

  const clearAll = () => {
    onSelectionChange([])
  }

  const handleConfirm = () => {
    onClose()
  }

  const getLocationLabel = (locationKey: string) => {
    const [cityId, bairro] = locationKey.split(":")
    const city = locationOptions.find((loc) => loc.id === cityId)
    if (!city) return locationKey

    if (bairro) {
      return `${bairro}, ${city.cidade} - ${city.estado}`
    }
    return `${city.cidade} - ${city.estado}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col sm:w-full w-[90%]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Selecionar Localização
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar cidade ou bairro..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Selected locations */}
          {selectedLocations.length > 0 && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-900">
                  {selectedLocations.length} localização(ões) selecionada(s)
                </span>
                <Button variant="ghost" size="sm" onClick={clearAll} className="text-blue-600 h-auto p-1">
                  Limpar todas
                </Button>
              </div>
              <div className="flex flex-wrap gap-1">
                {selectedLocations.map((locationKey) => (
                  <span
                    key={locationKey}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {getLocationLabel(locationKey)}
                    <button
                      onClick={() => removeLocation(locationKey)}
                      className="hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Location list */}
          <div className="flex-1 overflow-y-auto space-y-2">
            {filteredLocations.map((location) => (
              <div key={location.id} className="border rounded-lg">
                {/* City header */}
                <div
                  className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleCity(location.id)}
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={selectedLocations.includes(location.id)}
                      onCheckedChange={(checked) => handleLocationChange(location.id, checked as boolean)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div>
                      <span className="font-medium">
                        {location.cidade} - {location.estado}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">({location.bairros.length} bairros)</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-auto p-1">
                    {expandedCities.includes(location.id) ? "−" : "+"}
                  </Button>
                </div>

                {/* Neighborhoods */}
                {expandedCities.includes(location.id) && (
                  <div className="border-t bg-gray-50 p-3">
                    <div className="grid grid-cols-2 gap-2">
                      {location.bairros.map((bairro) => {
                        const locationKey = `${location.id}:${bairro}`
                        return (
                          <div key={bairro} className="flex items-center gap-2">
                            <Checkbox
                              id={locationKey}
                              checked={selectedLocations.includes(locationKey)}
                              onCheckedChange={(checked) => handleLocationChange(locationKey, checked as boolean)}
                            />
                            <label htmlFor={locationKey} className="text-sm cursor-pointer">
                              {bairro}
                            </label>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm}>Confirmar Seleção</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
