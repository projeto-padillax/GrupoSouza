"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function EditBannerPage({ params }: { params: { id: string } }) {
  const [bannerData, setBannerData] = useState({
    status: "ativo",
    currentImage: "/hero-house.jpg",
    newImage: null as File | null,
    title: "Imóveis à Venda",
    subtitle: "em Piracicaba",
    url: "busca/comprar/cidade/piracicaba/1/",
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setBannerData({ ...bannerData, newImage: file })
    }
  }

  const handleSave = () => {
    alert("Banner salvo com sucesso!")
    window.location.href = "/admin/banners"
  }

  const handleBack = () => {
    window.location.href = "/admin/banners"
  }

  return (
    <div>
      <main className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-2xl font-medium text-gray-700 mb-6">Edição de Banner na Home</h1>

            <Card className="border border-gray-300 rounded-lg">
              <CardContent className="p-8 space-y-8">
                {/* Status */}
                <div className="flex items-center gap-8">
                  <Label className="text-gray-700 font-medium w-24">Status:</Label>
                  <RadioGroup
                    value={bannerData.status}
                    onValueChange={(value) => setBannerData({ ...bannerData, status: value })}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ativo" id="ativo" />
                      <Label htmlFor="ativo" className="text-gray-700">
                        Ativo
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="inativo" id="inativo" />
                      <Label htmlFor="inativo" className="text-gray-700">
                        Inativo
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Banner Atual */}
                <div className="flex items-start gap-8">
                  <Label className="text-gray-700 font-medium w-24 mt-2">Banner Atual:</Label>
                  <div>
                    <img
                      src={bannerData.currentImage || "/placeholder.svg"}
                      alt="Banner atual"
                      className="w-80 h-48 object-cover rounded border"
                    />
                  </div>
                </div>

                {/* Novo Banner */}
                <div className="flex items-start gap-8">
                  <Label className="text-gray-700 font-medium w-24 mt-2">Novo Banner:</Label>
                  <div className="flex-1">
                    <Input type="file" accept="image/jpeg,image/png" onChange={handleFileChange} className="mb-2" />
                    <p className="text-sm text-blue-600">(JPG/PNG 1920x750px)</p>
                  </div>
                </div>

                <hr className="border-gray-300" />

                {/* Título */}
                <div className="flex items-center gap-8">
                  <Label className="text-gray-700 font-medium w-24">Título:</Label>
                  <Input
                    value={bannerData.title}
                    onChange={(e) => setBannerData({ ...bannerData, title: e.target.value })}
                    className="flex-1"
                    placeholder="Digite o título do banner"
                  />
                </div>

                {/* Subtítulo */}
                <div className="flex items-center gap-8">
                  <Label className="text-gray-700 font-medium w-24">Subtítulo:</Label>
                  <Input
                    value={bannerData.subtitle}
                    onChange={(e) => setBannerData({ ...bannerData, subtitle: e.target.value })}
                    className="flex-1"
                    placeholder="Digite o subtítulo do banner"
                  />
                </div>

                {/* URL */}
                <div className="flex items-start gap-8">
                  <div className="w-24">
                    <Label className="text-gray-700 font-medium">URL:</Label>
                    <p className="text-xs text-blue-600 mt-1">(com https://)</p>
                  </div>
                  <Textarea
                    value={bannerData.url}
                    onChange={(e) => setBannerData({ ...bannerData, url: e.target.value })}
                    className="flex-1 min-h-32"
                    placeholder="Digite a URL de destino do banner"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Botões */}
            <Card className="border border-gray-300 rounded-lg mt-4">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <Button onClick={handleSave} className="bg-gray-800 hover:bg-gray-900 text-white px-8">
                    Salvar
                  </Button>
                  <Button variant="outline" onClick={handleBack} className="px-8 bg-gray-300 hover:bg-gray-400">
                    Voltar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}