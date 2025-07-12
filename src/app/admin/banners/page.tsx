"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import { AdminTable } from "@/components/admin/adminTable"
import { AdminHeader } from "@/components/admin/adminHeader"
import { ActionButtons } from "@/components/admin/actionButtons"
import { useAdminListHandlers } from "@/hooks/adminHandlers"

interface Banner {
  id: number
  title: string
  subtitle: string
  url: string
  date: string
  status: "Ativo" | "Inativo"
}

export default function BannersListPage() {
  const [banners, setBanners] = useState<Banner[]>([
    {
      id: 1,
      title: "Imóveis à Venda",
      subtitle: "em Piracicaba",
      url: "busca/comprar/cidade/piracicaba/1/",
      date: "04/06/2025 às 11:04:09",
      status: "Ativo",
    },
    {
      id: 2,
      title: "Imóveis para Locação",
      subtitle: "em Piracicaba",
      url: "busca/alugar/cidade/piracicaba/1/",
      date: "03/06/2025 às 06:44:02",
      status: "Ativo",
    },
    {
      id: 3,
      title: "Imóveis à venda",
      subtitle: "em Portugal",
      url: "busca/comprar/pais/portugal/1/",
      date: "04/06/2025 às 11:06:38",
      status: "Ativo",
    },
  ])

  const {
    selectedIds,
    handleSelectAll,
    handleSelectOne,
    handleEdit,
    handleDelete,
    handleActivate,
    handleDeactivate
  } = useAdminListHandlers({
    items: banners,
    setItems: setBanners,
    itemNameSingular: "banner",
    routeBase: "/admin/banners"
  })

  return (
    <div>
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          {/* Header Section */}
          <AdminHeader
            title="Banners na Home"
            subtitle="Gerencie os registros no Painel de Controle."
            total={banners.length}
            ativos={banners.filter((b) => b.status === "Ativo").length}
            selecionados={selectedIds.length}
          />
          {/* Action Buttons */}
          <ActionButtons
            addButtonText="Novo Banner"
            addButtonHref="/admin/banners/novo"
            onAtivar={handleActivate}
            onDesativar={handleDeactivate}
            onExcluir={() => handleDelete()}
          />
          {/* Table */}
          <AdminTable
            data={banners}
            selectedIds={selectedIds}
            onSelect={handleSelectOne}
            onSelectAll={handleSelectAll}
            columns={[
              {
                header: "Subtítulo",
                accessor: "subtitle",
                cell: (item) => <span className="text-gray-700 text-base">{item.subtitle}</span>
              },
              {
                header: "Data",
                accessor: "date",
                cell: (item) => <span className="text-gray-600 text-sm">{item.date}</span>
              }
            ]}
            renderActions={(item) => (
              <Link href={`/admin/banners/${item.id}/edit`}>
                <Button variant="outline" size="sm" className="bg-transparent">
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
              </Link>
            )}
          />
        </div>
      </main >
    </div >
  )
}
