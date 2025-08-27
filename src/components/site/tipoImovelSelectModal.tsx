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
  const [tempSelectedTypes, setTempSelectedTypes] = useState<string[]>([])

  useEffect(() => {
    if (isOpen) {

      setTempSelectedTypes(selectedTypes);
    }
  }, [isOpen, selectedTypes]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 650);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const residenciaisTypes = [
    { id: "apartamento", label: "Apartamentos" },
    { id: "áreas empresariais", label: "Áreas Empresariais" },
    { id: "chácara", label: "Chácaras" },
    { id: "condominio fechado", label: "Condomínios Fechados" },
    { id: "loteamento em condominio", label: "Loteamentos em Condomínios" },
    { id: "residencias", label: "Residências" },
    {
      id: "residencia/predios comerciais",
      label: "Residências/Prédios Comerciais",
    },
    { id: "sitio", label: "Sítios" },
  ];

  const comerciaisTypes = [
    { id: "barracões", label: "Barracões" },
    { id: "comercial", label: "Comerciais" },
    { id: "estacionamento", label: "Estacionamentos" },
    { id: "galpões e áreas empresariais", label: "Galpões e Áreas Empresariais" },
    { id: "ponto comercial", label: "Pontos Comerciais" },
    { id: "predio comercial", label: "Prédios Comerciais" },
    { id: "sala comercial", label: "Salas Comerciais" },
    { id: "salões", label: "Salões" },
    { id: "terreno", label: "Terrenos" },
    { id: "vaga de garagem", label: "Vagas de Garagem" },
  ];

  const handleTypeChange = (typeId: string, checked: boolean) => {
    if (checked) {
      setTempSelectedTypes([...tempSelectedTypes, typeId]);
    } else {
      setTempSelectedTypes(tempSelectedTypes.filter((id) => id !== typeId));
    }
  };

  const handleConfirm = () => {
    onSelectionChange(tempSelectedTypes);
    // console.log("Selected Types:", tempSelectedTypes);
    onClose();
  };

  const allResidenciaisSelected = residenciaisTypes.every((t) =>
    tempSelectedTypes.includes(t.id)
  );
  const someResidenciaisSelected = residenciaisTypes.some((t) =>
    tempSelectedTypes.includes(t.id)
  );

  const allComerciaisSelected = comerciaisTypes.every((t) =>
    tempSelectedTypes.includes(t.id)
  );
  const someComerciaisSelected = comerciaisTypes.some((t) =>
    tempSelectedTypes.includes(t.id)
  );

  const handleSelectAll = (types: { id: string }[], checked: boolean) => {
    const ids = types.map((t) => t.id);
    if (checked) {
      const updated = [...tempSelectedTypes];
      ids.forEach((id) => {
        if (!updated.includes(id)) updated.push(id);
      });
      setTempSelectedTypes(updated);
    } else {
      setTempSelectedTypes(tempSelectedTypes.filter((id) => !ids.includes(id)));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="lg:max-w-2xl w-[70vw] sm:w-full h-[80vh] p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            Tipos de Imóveis
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
                  <h3 className="font-medium text-lg text-white">Residenciais</h3>
                </div>
                <div className="space-y-2">
                  {residenciaisTypes.map((type) => (
                    <div
                      key={type.id}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors border-0 shadow-none ${
                        tempSelectedTypes.includes(type.id)
                          ? "border shadow-sm"
                          : "hover:bg-gray-50 border border-transparent"
                      }`}
                      onClick={() =>
                        handleTypeChange(
                          type.id,
                          !tempSelectedTypes.includes(type.id)
                        )
                      }
                    >
                      <Checkbox
                        checked={tempSelectedTypes.includes(type.id)}
                        onCheckedChange={(checked) =>
                          handleTypeChange(type.id, checked as boolean)
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className="text-sm">
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
                  <h3 className="font-medium text-lg text-white">Comerciais</h3>
                </div>
                <div className="space-y-2">
                  {comerciaisTypes.map((type) => (
                    <div
                      key={type.id}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors border-0 shadow-none ${
                        tempSelectedTypes.includes(type.id)
                          ? " border shadow-sm"
                          : "hover:bg-gray-50 border border-transparent"
                      }`}
                      onClick={() =>
                        handleTypeChange(
                          type.id,
                          !tempSelectedTypes.includes(type.id)
                        )
                      }
                    >
                      <Checkbox
                        checked={tempSelectedTypes.includes(type.id)}
                        onCheckedChange={(checked) =>
                          handleTypeChange(type.id, checked as boolean)
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className="text-sm">
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
                <div className="p-4 pl-3 border-b flex items-center gap-2 border-0 shadow-none bg-[#4F7DC3]">
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
                  <h3 className="font-medium text-lg text-white">Residenciais</h3>
                </div>
                <div className="p-4 space-y-2 pl-0">
                  {residenciaisTypes.map((type) => (
                    <div
                      key={type.id}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors pr-0 border-0 shadow-none ${
                        tempSelectedTypes.includes(type.id)
                          ? "border  shadow-sm"
                          : "hover:bg-gray-50 border border-transparent"
                      }`}
                      onClick={() =>
                        handleTypeChange(
                          type.id,
                          !tempSelectedTypes.includes(type.id)
                        )
                      }
                    >
                      <Checkbox
                        checked={tempSelectedTypes.includes(type.id)}
                        onCheckedChange={(checked) =>
                          handleTypeChange(type.id, checked as boolean)
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className="text-sm">
                        {type.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comerciais */}
              <div className="border rounded-lg overflow-hidden">
                <div className="p-4 pl-3 border-b flex items-center gap-2 border-0 shadow-none bg-[#4F7DC3]">
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
                  <h3 className="font-medium text-lg text-white">Comerciais</h3>
                </div>
                <div className="p-4 space-y-2 pl-0">
                  {comerciaisTypes.map((type) => (
                    <div
                      key={type.id}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors pr-0 border-0 shadow-none ${
                        tempSelectedTypes.includes(type.id)
                          ? " border  shadow-sm"
                          : "hover:bg-gray-50 border border-transparent"
                      }`}
                      onClick={() =>
                        handleTypeChange(
                          type.id,
                          !tempSelectedTypes.includes(type.id)
                        )
                      }
                    >
                      <Checkbox
                        checked={tempSelectedTypes.includes(type.id)}
                        onCheckedChange={(checked) =>
                          handleTypeChange(type.id, checked as boolean)
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className="text-sm">
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
