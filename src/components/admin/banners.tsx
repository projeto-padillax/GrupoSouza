"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import { AdminTable } from "@/components/admin/adminTable"
import { AdminHeader } from "@/components/admin/adminHeader"
import { useAdminListHandlers } from "@/hooks/adminHandlers"
import { useState } from "react"
import { Banners as BannerORM } from "@prisma/client";
import { ActionButtons } from "./actionButtons"

interface Props {
  initialBanners: BannerORM[]
}

export default function BannersListClient({ initialBanners }: Props) {
  const [banners, setBanners] = useState(initialBanners)

  const {
    selectedIds,
    handleSelectAll,
    handleSelectOne,
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
            ativos={banners.filter((banner: BannerORM) => banner.status === true).length}
            selecionados={selectedIds.length}
          />
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
                cell: (item) => <span className="text-gray-700 text-base">{item.subtitulo}</span>
              },
              {
                header: "Data",
                accessor: "date",
                cell: (item) => <span className="text-gray-600 text-sm">{new Date(item.createdAt).toLocaleDateString("pt-BR")}</span>
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