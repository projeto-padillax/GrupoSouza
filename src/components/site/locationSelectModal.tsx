"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Search } from "lucide-react";

interface LocationOption {
  cidade: string;
  bairros: string[];
}

interface LocationSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLocations: string[];
  onSelectionChange: (locations: string[]) => void;
}

export function LocationSelectModal({
  isOpen,
  onClose,
  selectedLocations,
  onSelectionChange,
}: LocationSelectModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCities, setExpandedCities] = useState<string[]>([]);
  const [cidades, setCidades] = useState<LocationOption[]>([]);

  useEffect(() => {
    const fetchCidades = async () => {
      try {
        const res = await fetch("/api/vista/cidades");
        if (!res.ok) throw new Error("Erro ao buscar cidades");
        const data = await res.json();

        const cidadesMapeadas = data.cidades.map(
          (item: { cidade: string; bairros: string[] }) => ({
            cidade:
              item.cidade.charAt(0).toUpperCase() +
              item.cidade.slice(1).toLowerCase(),
            bairros: item.bairros,
          })
        );

        const cidadesOrdenadas = cidadesMapeadas.sort(
          (a: LocationOption, b: LocationOption) => {
            if (a.cidade.toLowerCase() === "piracicaba") return -1;
            if (b.cidade.toLowerCase() === "piracicaba") return 1;
            return a.cidade.localeCompare(b.cidade);
          }
        );

        setCidades(cidadesOrdenadas);
setExpandedCities([cidadesOrdenadas[0].cidade]);
      } catch (error) {
        console.error("Erro ao carregar cidades:", error);
      }
    };

    fetchCidades();
  }, []);

  const filteredLocations = cidades.filter(
    (location) =>
      location.cidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.bairros.some((bairro) =>
        bairro.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

const toggleCity = (cityId: string) => {
  const isCurrentlyExpanded = expandedCities.includes(cityId);

  if (isCurrentlyExpanded) {
    setExpandedCities([]);
    onSelectionChange([]);
  } else {
    setExpandedCities([cityId]);
    onSelectionChange([]);
  }
};

const handleLocationChange = (locationKey: string, checked: boolean) => {
  const isCity = !locationKey.includes(":");

  if (isCity) {
    if (checked) {
      onSelectionChange([`${locationKey}:all`]); 
    } else {
      onSelectionChange([]);
    }
  } else {
    const [cidade] = locationKey.split(":");

    if (selectedLocations.includes(`${cidade}:all`)) return;

    if (checked) {
      onSelectionChange([...selectedLocations, locationKey]);
    } else {
      onSelectionChange(selectedLocations.filter((loc) => loc !== locationKey));
    }
  }
};

  const handleConfirm = () => {
    console.log("Selected Locations:", selectedLocations);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-4xl max-w-4xl max-h-[80vh] overflow-hidden flex flex-col w-[80%]"
        aria-describedby="Selecione uma localização"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
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
              className="pl-10 focus-visible:ring-[0px]"
            />
          </div>

          {/* Location list */}
          <div className="flex-1 overflow-y-auto space-y-2">
            {filteredLocations.map((location) => (
              <div key={location.cidade} className="border rounded-lg">
                {/* City header */}
                <div
                  className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleCity(location.cidade)}
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={selectedLocations.includes(
                        `${location.cidade}:all`
                      )}
                      onCheckedChange={(checked) =>
                        handleLocationChange(
                          location.cidade,
                          checked as boolean
                        )
                      }
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div>
                      <span className="font-medium">{location.cidade}</span>
                      <span className="text-sm text-gray-500 ml-2">
                        ({location.bairros.length} bairros)
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-auto p-1">
                    {expandedCities.includes(location.cidade) ? "−" : "+"}
                  </Button>
                </div>

                {/* Neighborhoods */}
                {expandedCities.includes(location.cidade) && (
                  <div className="border-t bg-gray-50 p-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                      {location.bairros.map((bairro) => {
                        const locationKey = `${location.cidade}:${bairro}`;
                        return (
                          <div key={bairro} className="flex items-center gap-2">
                            <Checkbox
                              id={locationKey}
                              checked={selectedLocations.includes(locationKey)}
                              disabled={selectedLocations.includes(`${location.cidade}:all`)}
                              onCheckedChange={(checked) =>
                                handleLocationChange(
                                  locationKey,
                                  checked as boolean
                                )
                              }
                            />
                            <label
                              htmlFor={locationKey}
                              className="text-sm cursor-pointer"
                            >
                              {bairro}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-center pt-4 border-t">
          <Button onClick={handleConfirm}>Confirmar Seleção</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
