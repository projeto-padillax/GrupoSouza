"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";

interface TypeSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTypes: string[];
  onSelectionChange: (types: string[]) => void;
}

export function TypeSelectModal({
  isOpen,
  onClose,
  selectedTypes,
  onSelectionChange,
}: TypeSelectModalProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 650);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const residenciaisTypes = [
    { id: "apartamentos", label: "Apartamentos" },
    { id: "areas-empresariais", label: "Áreas Empresariais" },
    { id: "chacaras", label: "Chácaras" },
    { id: "condominios-fechados", label: "Condomínios Fechados" },
    { id: "loteamentos-condominios", label: "Loteamentos em Condomínios" },
    { id: "residencias", label: "Residências" },
    {
      id: "residencias-predios-comerciais",
      label: "Residências/Prédios Comerciais",
    },
    { id: "sitios", label: "Sítios" },
  ];

  const comerciaisTypes = [
    { id: "barracoes", label: "Barracões" },
    { id: "comerciais", label: "Comerciais" },
    { id: "estacionamentos", label: "Estacionamentos" },
    { id: "galpoes-areas-empresariais", label: "Galpões e Áreas Empresariais" },
    { id: "pontos-comerciais", label: "Pontos Comerciais" },
    { id: "predios-comerciais", label: "Prédios Comerciais" },
    { id: "salas-comerciais", label: "Salas Comerciais" },
    { id: "saloes", label: "Salões" },
    { id: "terrenos", label: "Terrenos" },
    { id: "vagas-garagem", label: "Vagas de Garagem" },
  ];

  const handleTypeChange = (typeId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedTypes, typeId]);
    } else {
      onSelectionChange(selectedTypes.filter((id) => id !== typeId));
    }
  };

  const handleConfirm = () => {
    console.log(selectedTypes);
    onClose();
  };

  const allResidenciaisSelected = residenciaisTypes.every((t) =>
    selectedTypes.includes(t.id)
  );
  const someResidenciaisSelected = residenciaisTypes.some((t) =>
    selectedTypes.includes(t.id)
  );

  const allComerciaisSelected = comerciaisTypes.every((t) =>
    selectedTypes.includes(t.id)
  );
  const someComerciaisSelected = comerciaisTypes.some((t) =>
    selectedTypes.includes(t.id)
  );

  const handleSelectAll = (types: { id: string }[], checked: boolean) => {
    const ids = types.map((t) => t.id);
    if (checked) {
      const updated = [...selectedTypes];
      ids.forEach((id) => {
        if (!updated.includes(id)) updated.push(id);
      });
      onSelectionChange(updated);
    } else {
      onSelectionChange(selectedTypes.filter((id) => !ids.includes(id)));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="lg:max-w-2xl w-[70vw] sm:w-full h-[80vh] p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            Selecionar Tipos de Imóveis
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 pt-4 pb-2">
          {isMobile ? (
            <div className="space-y-4">
              {/* Residenciais */}
              <div>
                <div className="flex items-center gap-2 mb-2 ml-3 border-0 shadow-none">
                  <Checkbox
                    checked={allResidenciaisSelected}
                    ref={(el) => {
                      if (el)
                        (el as HTMLInputElement).indeterminate =
                          someResidenciaisSelected && !allResidenciaisSelected;
                    }}
                    onCheckedChange={(checked) =>
                      handleSelectAll(residenciaisTypes, checked as boolean)
                    }
                  />
                  <h3 className="font-semibold text-lg">Residenciais</h3>
                </div>
                <div className="space-y-2">
                  {residenciaisTypes.map((type) => (
                    <div
                      key={type.id}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors border-0 shadow-none ${
                        selectedTypes.includes(type.id)
                          ? "border shadow-sm"
                          : "hover:bg-gray-50 border border-transparent"
                      }`}
                      onClick={() =>
                        handleTypeChange(
                          type.id,
                          !selectedTypes.includes(type.id)
                        )
                      }
                    >
                      <Checkbox
                        checked={selectedTypes.includes(type.id)}
                        onCheckedChange={(checked) =>
                          handleTypeChange(type.id, checked as boolean)
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className="text-sm font-medium text-gray-900">
                        {type.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comerciais */}
              <div>
                <div className="flex items-center gap-2 mb-2 ml-3 border-0 shadow-none">
                  <Checkbox
                    checked={allComerciaisSelected}
                    ref={(el) => {
                      if (el)
                        (el as HTMLInputElement).indeterminate =
                          someComerciaisSelected && !allComerciaisSelected;
                    }}
                    onCheckedChange={(checked) =>
                      handleSelectAll(comerciaisTypes, checked as boolean)
                    }
                  />
                  <h3 className="font-semibold text-lg">Comerciais</h3>
                </div>
                <div className="space-y-2">
                  {comerciaisTypes.map((type) => (
                    <div
                      key={type.id}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors border-0 shadow-none ${
                        selectedTypes.includes(type.id)
                          ? " border shadow-sm"
                          : "hover:bg-gray-50 border border-transparent"
                      }`}
                      onClick={() =>
                        handleTypeChange(
                          type.id,
                          !selectedTypes.includes(type.id)
                        )
                      }
                    >
                      <Checkbox
                        checked={selectedTypes.includes(type.id)}
                        onCheckedChange={(checked) =>
                          handleTypeChange(type.id, checked as boolean)
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className="text-sm font-medium text-gray-900">
                        {type.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              {/* Residenciais */}
              <div className="border rounded-lg overflow-hidden">
                <div className="p-4 border-b flex items-center gap-2 ml-3 border-0 shadow-none">
                  <Checkbox
                    checked={allResidenciaisSelected}
                    ref={(el) => {
                      if (el)
                        (el as HTMLInputElement).indeterminate =
                          someResidenciaisSelected && !allResidenciaisSelected;
                    }}
                    onCheckedChange={(checked) =>
                      handleSelectAll(residenciaisTypes, checked as boolean)
                    }
                  />
                  <h3 className="font-semibold text-lg">Residenciais</h3>
                </div>
                <div className="p-4 space-y-2">
                  {residenciaisTypes.map((type) => (
                    <div
                      key={type.id}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors pr-0 border-0 shadow-none ${
                        selectedTypes.includes(type.id)
                          ? "border  shadow-sm"
                          : "hover:bg-gray-50 border border-transparent"
                      }`}
                      onClick={() =>
                        handleTypeChange(
                          type.id,
                          !selectedTypes.includes(type.id)
                        )
                      }
                    >
                      <Checkbox
                        checked={selectedTypes.includes(type.id)}
                        onCheckedChange={(checked) =>
                          handleTypeChange(type.id, checked as boolean)
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className="text-sm font-medium text-gray-900">
                        {type.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comerciais */}
              <div className="border rounded-lg overflow-hidden">
                <div className="p-4 border-b flex items-center gap-2 ml-3 border-0 shadow-none">
                  <Checkbox
                    checked={allComerciaisSelected}
                    ref={(el) => {
                      if (el)
                        (el as HTMLInputElement).indeterminate =
                          someComerciaisSelected && !allComerciaisSelected;
                    }}
                    onCheckedChange={(checked) =>
                      handleSelectAll(comerciaisTypes, checked as boolean)
                    }
                  />
                  <h3 className="font-semibold text-lg">Comerciais</h3>
                </div>
                <div className="p-4 space-y-2">
                  {comerciaisTypes.map((type) => (
                    <div
                      key={type.id}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors pr-0 border-0 shadow-none ${
                        selectedTypes.includes(type.id)
                          ? " border  shadow-sm"
                          : "hover:bg-gray-50 border border-transparent"
                      }`}
                      onClick={() =>
                        handleTypeChange(
                          type.id,
                          !selectedTypes.includes(type.id)
                        )
                      }
                    >
                      <Checkbox
                        checked={selectedTypes.includes(type.id)}
                        onCheckedChange={(checked) =>
                          handleTypeChange(type.id, checked as boolean)
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className="text-sm font-medium text-gray-900">
                        {type.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t p-6 pt-4">
          <div className="justify-self-center">
            <Button
              onClick={handleConfirm}
              className="order-1 sm:order-2 bg-[#4F7DC3] hover:bg-[#0084d7]"
            >
              Confirmar Seleção
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
