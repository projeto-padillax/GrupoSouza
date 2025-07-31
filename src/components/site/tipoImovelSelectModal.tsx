"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Home } from "lucide-react"

interface TypeSelectModalProps {
  isOpen: boolean
  onClose: () => void
  selectedTypes: string[]
  onSelectionChange: (types: string[]) => void
}

export function TypeSelectModal({ isOpen, onClose, selectedTypes, onSelectionChange }: TypeSelectModalProps) {
  // Tipos reais de imóveis
  const residenciaisTypes = [
    { id: "apartamentos", label: "Apartamentos" },
    { id: "areas-empresariais", label: "Áreas Empresariais" },
    { id: "chacaras", label: "Chácaras" },
    { id: "condominios-fechados", label: "Condomínios Fechados" },
    { id: "loteamentos-condominios", label: "Loteamentos em Condomínios" },
    { id: "residencias", label: "Residências" },
    { id: "residencias-predios-comerciais", label: "Residências/Prédios Comerciais" },
    { id: "sitios", label: "Sítios" },
  ]

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
  ]

  const handleTypeChange = (typeId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedTypes, typeId])
    } else {
      onSelectionChange(selectedTypes.filter((id) => id !== typeId))
    }
  }

  const handleSelectAllResidenciais = (checked: boolean) => {
    const residenciaisIds = residenciaisTypes.map((type) => type.id)
    if (checked) {
      const newTypes = [...selectedTypes]
      residenciaisIds.forEach((id) => {
        if (!newTypes.includes(id)) {
          newTypes.push(id)
        }
      })
      onSelectionChange(newTypes)
    } else {
      onSelectionChange(selectedTypes.filter((id) => !residenciaisIds.includes(id)))
    }
  }

  const handleSelectAllComerciais = (checked: boolean) => {
    const comerciaisIds = comerciaisTypes.map((type) => type.id)
    if (checked) {
      const newTypes = [...selectedTypes]
      comerciaisIds.forEach((id) => {
        if (!newTypes.includes(id)) {
          newTypes.push(id)
        }
      })
      onSelectionChange(newTypes)
    } else {
      onSelectionChange(selectedTypes.filter((id) => !comerciaisIds.includes(id)))
    }
  }

  const handleConfirm = () => {
    console.log(selectedTypes)
    onClose()
  }

  // Verificar se todos os residenciais estão selecionados
  const allResidenciaisSelected = residenciaisTypes.every((type) => selectedTypes.includes(type.id))
  const someResidenciaisSelected = residenciaisTypes.some((type) => selectedTypes.includes(type.id))

  // Verificar se todos os comerciais estão selecionados
  const allComerciaisSelected = comerciaisTypes.every((type) => selectedTypes.includes(type.id))
  const someComerciaisSelected = comerciaisTypes.some((type) => selectedTypes.includes(type.id))

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="lg:max-w-4xl w-[90vw] h-[80vh] p-0">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Selecionar Tipos de Imóveis
          </DialogTitle>
        </DialogHeader>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden p-6 pt-4">
          {/* Two columns layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            {/* Residenciais Column */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-blue-50 p-4 border-b">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg text-blue-900">🏠 Residenciais</h3>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={allResidenciaisSelected}
                      ref={(el) => {
                        if (el) (el as HTMLInputElement).indeterminate = someResidenciaisSelected && !allResidenciaisSelected
                      }}
                      onCheckedChange={handleSelectAllResidenciais}
                    />
                    <span className="text-sm text-blue-700 hidden sm:inline">Selecionar todos</span>
                    <span className="text-sm text-blue-700 sm:hidden">Todos</span>
                  </div>
                </div>
                <p className="text-xs text-blue-600">
                  {residenciaisTypes.filter((type) => selectedTypes.includes(type.id)).length} de{" "}
                  {residenciaisTypes.length} selecionados
                </p>
              </div>

              <div className="h-full overflow-y-auto p-4">
                <div className="space-y-2">
                  {residenciaisTypes.map((type) => (
                    <div
                      key={type.id}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedTypes.includes(type.id)
                          ? "bg-blue-50 border border-blue-200 shadow-sm"
                          : "hover:bg-gray-50 border border-transparent"
                      }`}
                      onClick={() => handleTypeChange(type.id, !selectedTypes.includes(type.id))}
                    >
                      <Checkbox
                        checked={selectedTypes.includes(type.id)}
                        onCheckedChange={(checked) => handleTypeChange(type.id, checked as boolean)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className="text-sm font-medium text-gray-900">{type.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Comerciais Column */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-green-50 p-4 border-b">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg text-green-900">🏢 Comerciais</h3>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={allComerciaisSelected}
                      ref={(el) => {
                        if (el) (el as HTMLInputElement).indeterminate = someComerciaisSelected && !allComerciaisSelected
                      }}
                      onCheckedChange={handleSelectAllComerciais}
                    />
                    <span className="text-sm text-green-700 hidden sm:inline">Selecionar todos</span>
                    <span className="text-sm text-green-700 sm:hidden">Todos</span>
                  </div>
                </div>
                <p className="text-xs text-green-600">
                  {comerciaisTypes.filter((type) => selectedTypes.includes(type.id)).length} de {comerciaisTypes.length}{" "}
                  selecionados
                </p>
              </div>

              <div className="h-full overflow-y-auto p-4">
                <div className="space-y-2">
                  {comerciaisTypes.map((type) => (
                    <div
                      key={type.id}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedTypes.includes(type.id)
                          ? "bg-green-50 border border-green-200 shadow-sm"
                          : "hover:bg-gray-50 border border-transparent"
                      }`}
                      onClick={() => handleTypeChange(type.id, !selectedTypes.includes(type.id))}
                    >
                      <Checkbox
                        checked={selectedTypes.includes(type.id)}
                        onCheckedChange={(checked) => handleTypeChange(type.id, checked as boolean)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className="text-sm font-medium text-gray-900">{type.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-6 pt-4">
          <div className="justify-self-center">
            <Button onClick={handleConfirm} className="order-1 sm:order-2 bg-[#001c40] hover:cursor-pointer hover:bg-[#0084d7]">
              Confirmar Seleção ({selectedTypes.length})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
