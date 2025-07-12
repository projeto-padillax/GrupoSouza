"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Save, ArrowLeft, ImageIcon } from "lucide-react"

export default function NewBannerPage() {
  const [bannerData, setBannerData] = useState({
    status: "ativo",
    newImage: null as File | null,
    title: "",
    subtitle: "",
    url: "",
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setBannerData({ ...bannerData, newImage: file })
    }
  }

  const handleSave = () => {
    if (!bannerData.title || !bannerData.subtitle || !bannerData.url) {
      alert("Por favor, preencha todos os campos obrigatórios")
      return
    }
    alert("Banner criado com sucesso!")
    window.location.href = "/admin/banners"
  }

  const handleBack = () => {
    window.location.href = "/admin/banners"
  }

  return (
    <div>
      <main className="py-12">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10">
          {/* Header */}
          <div className="mb-8">
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
              <h1 className="text-3xl font-semibold text-gray-900 mb-2">Novo Banner na Home</h1>
              <p className="text-lg text-gray-600">Crie um novo banner para a página inicial</p>
            </div>
          </div>

          {/* Main Form */}
          <Card className="border border-gray-200 rounded-xl shadow-sm bg-white">
            <CardContent className="p-8 space-y-8">
              {/* Status */}
              <div className="flex items-center gap-8">
                <Label className="text-gray-900 font-medium text-lg w-28">Status:</Label>
                <RadioGroup
                  value={bannerData.status}
                  onValueChange={(value) => setBannerData({ ...bannerData, status: value })}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ativo" id="ativo" className="scale-110" />
                    <Label htmlFor="ativo" className="text-gray-700 text-base font-medium">
                      Ativo
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="inativo" id="inativo" className="scale-110" />
                    <Label htmlFor="inativo" className="text-gray-700 text-base font-medium">
                      Inativo
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Banner */}
              <div className="flex items-start gap-8">
                <Label className="text-gray-900 font-medium text-lg w-28 mt-2">Banner:</Label>
                <div className="flex-1">
                  <div className="relative">
                    <Input
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={handleFileChange}
                      className="text-base py-3 px-4 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <ImageIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                  <p className="text-blue-600 font-medium mt-2 text-sm">(JPG/PNG 1920x750px)</p>
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* Título */}
              <div className="flex items-center gap-8">
                <Label className="text-gray-900 font-medium text-lg w-28">Título:</Label>
                <Input
                  value={bannerData.title}
                  onChange={(e) => setBannerData({ ...bannerData, title: e.target.value })}
                  className="flex-1 text-base py-3 px-4 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50"
                  placeholder="Digite o título do banner"
                />
              </div>

              {/* Subtítulo */}
              <div className="flex items-center gap-8">
                <Label className="text-gray-900 font-medium text-lg w-28">Subtítulo:</Label>
                <Input
                  value={bannerData.subtitle}
                  onChange={(e) => setBannerData({ ...bannerData, subtitle: e.target.value })}
                  className="flex-1 text-base py-3 px-4 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50"
                  placeholder="Digite o subtítulo do banner"
                />
              </div>

              {/* URL */}
              <div className="flex items-start gap-8">
                <div className="w-28">
                  <Label className="text-gray-900 font-medium text-lg">URL:</Label>
                  <p className="text-blue-600 font-medium mt-1 text-sm">(com https://)</p>
                </div>
                <Textarea
                  value={bannerData.url}
                  onChange={(e) => setBannerData({ ...bannerData, url: e.target.value })}
                  className="flex-1 min-h-32 text-base py-3 px-4 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 resize-none"
                  placeholder="Digite a URL de destino do banner"
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card className="border border-gray-200 rounded-xl shadow-sm bg-white mt-6">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <Button
                  onClick={handleSave}
                  size="lg"
                  className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 text-base font-medium rounded-lg shadow-sm transition-colors duration-200"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Salvar
                </Button>
                <Button
                  variant="outline"
                  onClick={handleBack}
                  size="lg"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-base font-medium rounded-lg transition-colors duration-200 bg-transparent"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
