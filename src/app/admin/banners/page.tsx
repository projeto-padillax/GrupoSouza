"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Plus, Edit, Power, PowerOff, Trash2 } from "lucide-react"

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

  const [selectedBanners, setSelectedBanners] = useState<number[]>([])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedBanners(banners.map((banner) => banner.id))
    } else {
      setSelectedBanners([])
    }
  }

  const handleSelectBanner = (bannerId: number, checked: boolean) => {
    if (checked) {
      setSelectedBanners([...selectedBanners, bannerId])
    } else {
      setSelectedBanners(selectedBanners.filter((id) => id !== bannerId))
    }
  }

  const handleEdit = () => {
    if (selectedBanners.length === 0) {
      alert("Selecione um banner para editar")
      return
    }
    if (selectedBanners.length > 1) {
      alert("Selecione apenas um banner para editar")
      return
    }
    window.location.href = `/admin/banners/${selectedBanners[0]}/edit`
  }

  const handleActivate = () => {
    if (selectedBanners.length === 0) {
      alert("Selecione pelo menos um banner para ativar")
      return
    }
    setBanners(
      banners.map((banner) => (selectedBanners.includes(banner.id) ? { ...banner, status: "Ativo" as const } : banner)),
    )
    setSelectedBanners([])
    alert(`${selectedBanners.length} banner(s) ativado(s) com sucesso!`)
  }

  const handleDeactivate = () => {
    if (selectedBanners.length === 0) {
      alert("Selecione pelo menos um banner para desativar")
      return
    }
    setBanners(
      banners.map((banner) =>
        selectedBanners.includes(banner.id) ? { ...banner, status: "Inativo" as const } : banner,
      ),
    )
    setSelectedBanners([])
    alert(`${selectedBanners.length} banner(s) desativado(s) com sucesso!`)
  }

  const handleDelete = () => {
    if (selectedBanners.length === 0) {
      alert("Selecione pelo menos um banner para excluir")
      return
    }
    if (confirm(`Tem certeza que deseja excluir ${selectedBanners.length} banner(s)?`)) {
      setBanners(banners.filter((banner) => !selectedBanners.includes(banner.id)))
      setSelectedBanners([])
      alert(`${selectedBanners.length} banner(s) excluído(s) com sucesso!`)
    }
  }

  return (
    <div>
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          {/* Header Section */}
          <div className="mb-10">
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
              <h1 className="text-3xl font-semibold text-gray-900 mb-3">Banners na Home</h1>
              <p className="text-lg text-gray-600">Gerencie os registros no Painel de Controle.</p>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-600 text-sm font-medium">Total de Banners</p>
                      <p className="text-2xl font-semibold text-slate-900 mt-1">{banners.length}</p>
                    </div>
                    <div className="bg-slate-100 rounded-lg p-3">
                      <ExternalLink className="h-5 w-5 text-slate-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-emerald-700 text-sm font-medium">Banners Ativos</p>
                      <p className="text-2xl font-semibold text-emerald-900 mt-1">
                        {banners.filter((b) => b.status === "Ativo").length}
                      </p>
                    </div>
                    <div className="bg-emerald-100 rounded-lg p-3">
                      <Power className="h-5 w-5 text-emerald-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-700 text-sm font-medium">Selecionados</p>
                      <p className="text-2xl font-semibold text-blue-900 mt-1">{selectedBanners.length}</p>
                    </div>
                    <div className="bg-blue-100 rounded-lg p-3">
                      <Edit className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex flex-wrap gap-3">
                <Link href="/admin/banners/novo">
                  <Button
                    size="lg"
                    className="bg-blue-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg shadow-sm transition-colors duration-200"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Banner
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleEdit}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg transition-colors duration-200 bg-transparent"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleActivate}
                  className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 px-6 py-3 rounded-lg transition-colors duration-200 bg-transparent"
                >
                  <Power className="h-4 w-4 mr-2" />
                  Ativar
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleDeactivate}
                  className="border-amber-300 text-amber-700 hover:bg-amber-50 px-6 py-3 rounded-lg transition-colors duration-200 bg-transparent"
                >
                  <PowerOff className="h-4 w-4 mr-2" />
                  Desativar
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleDelete}
                  className="border-red-300 text-red-700 hover:bg-red-50 px-6 py-3 rounded-lg transition-colors duration-200 bg-transparent"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </Button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 border-b border-gray-200">
                  <TableHead className="w-16 py-5 text-center">
                    <Checkbox
                      checked={selectedBanners.length === banners.length}
                      onCheckedChange={handleSelectAll}
                      className="scale-110 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 text-base py-5">Título</TableHead>
                  <TableHead className="font-semibold text-gray-900 text-base py-5">Subtítulo</TableHead>
                  <TableHead className="font-semibold text-gray-900 text-base py-5">URL</TableHead>
                  <TableHead className="font-semibold text-gray-900 text-base py-5">Data</TableHead>
                  <TableHead className="font-semibold text-gray-900 text-base py-5 text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {banners.map((banner, index) => (
                  <TableRow
                    key={banner.id}
                    className={`hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                    }`}
                  >
                    <TableCell className="py-5 text-center">
                      <Checkbox
                        checked={selectedBanners.includes(banner.id)}
                        onCheckedChange={(checked) => handleSelectBanner(banner.id, checked as boolean)}
                        className="scale-110 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      />
                    </TableCell>
                    <TableCell className="py-5">
                      <span className="text-gray-900 font-medium text-base">{banner.title}</span>
                    </TableCell>
                    <TableCell className="text-gray-700 text-base py-5">{banner.subtitle}</TableCell>
                    <TableCell className="py-5">
                      <a
                        href={`https://example.com/${banner.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:underline font-medium text-base bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors duration-200"
                      >
                        Abrir URL
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </TableCell>
                    <TableCell className="text-gray-600 text-sm py-5">{banner.date}</TableCell>
                    <TableCell className="text-center py-5">
                      <Badge
                        variant={banner.status === "Ativo" ? "default" : "secondary"}
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          banner.status === "Ativo"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : "bg-gray-100 text-gray-700 border border-gray-200"
                        }`}
                      >
                        {banner.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  )
}
