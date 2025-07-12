"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import { AdminTable } from "@/components/admin/adminTable"
import { AdminHeader } from "@/components/admin/adminHeader"
import { ActionButtons } from "@/components/admin/actionButtons"
import { useAdminListHandlers } from "@/hooks/adminHandlers"

interface Slide {
    id: number
    title: string
    url: string
    ordem: number
    date: string
    status: "Ativo" | "Inativo"
}

export default function SlidesListPage() {
    const [slides, setSlides] = useState<Slide[]>([
        {
            id: 1,
            title: "Atendimento Whatsapp",
            url: "busca/comprar/cidade/piracicaba/1/",
            ordem: 1,
            date: "04/06/2025 às 11:04:09",
            status: "Ativo",
        },
        {
            id: 2,
            title: "Atendimento Instagram",
            url: "busca/alugar/cidade/piracicaba/1/",
            ordem: 2,
            date: "03/06/2025 às 06:44:02",
            status: "Ativo",
        },
        {
            id: 3,
            title: "Anuncie Conosco",
            url: "busca/comprar/pais/portugal/1/",
            ordem: 3,
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
        items: slides,
        setItems: setSlides,
        itemNameSingular: "slide",
        routeBase: "/admin/slides"
    })

    return (
        <div>
            <main className="py-12">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
                    {/* Header Section */}
                    <AdminHeader
                        title="Slides na Home"
                        subtitle="Gerencie os registros no Painel de Controle."
                        total={slides.length}
                        ativos={slides.filter((b) => b.status === "Ativo").length}
                        selecionados={selectedIds.length}
                    />
                    {/* Action Buttons */}
                    <ActionButtons
                        addButtonText="Novo Slide"
                        addButtonHref="/admin/slides/novo"
                        onAtivar={handleActivate}
                        onDesativar={handleDeactivate}
                        onExcluir={() => handleDelete()}
                    />
                    {/* Table */}
                    <AdminTable
                        data={slides}
                        selectedIds={selectedIds}
                        onSelect={handleSelectOne}
                        onSelectAll={handleSelectAll}
                        columns={[
                            {
                                header: "Ordem",
                                accessor: "ordem",
                                cell: (item) => <span className="text-gray-700 text-base">{item.ordem}</span>
                            },
                            {
                                header: "Data",
                                accessor: "date",
                                cell: (item) => <span className="text-gray-600 text-sm">{item.date}</span>
                            }
                        ]}
                        renderActions={(item) => (
                            <Link href={`/admin/slides/${item.id}/edit`}>
                                <Button variant="outline" size="sm" className="bg-transparent">
                                    <Edit className="h-4 w-4 mr-1" />
                                    Editar
                                </Button>
                            </Link>
                        )}
                    />
                </div>
            </main>
        </div>
    )
}
