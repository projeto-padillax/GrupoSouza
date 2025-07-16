"use client"

import { useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ImageIcon } from "lucide-react"
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import Image from "next/image"
import { FieldValues, Path, UseFormReturn } from "react-hook-form/dist/types"

type FormFieldsProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  previewImage: string;
  setPreviewImage: (url: string) => void;
  showOrdenacao?: boolean;
  showImagem?: boolean;
  imagemLabel?: string;
  showSubtitulo?: boolean;
};

export function FormFields<T extends FieldValues>({
  form,
  previewImage,
  setPreviewImage,
  showOrdenacao = false,
  showImagem = false,
  imagemLabel = "Imagem",
  showSubtitulo = false,
}: FormFieldsProps<T>) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handlePreview = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setPreviewImage(result)
    }
    reader.readAsDataURL(file)
  }

  return (
    <>
      {/* Status - SEMPRE */}
      <FormField
        control={form.control}
        name={"status" as Path<T>}
        render={({ field }) => (
          <FormItem className="flex items-center gap-8">
            <Label className="text-gray-900 font-medium text-lg w-28">Status:</Label>
            <FormControl>
              <RadioGroup
                value={field.value ? "ativo" : "inativo"}
                onValueChange={(value) => field.onChange(value === "ativo")}
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
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Ordem - OPCIONAL */}
      {showOrdenacao && (
        <FormField
          control={form.control}
          name={"ordem" as Path<T>}
          render={({ field }) => (
            <FormItem className="flex items-center gap-8">
              <Label className="text-gray-900 font-medium text-lg w-28">Ordem:</Label>
              <FormControl>
                   <select
                    value={field.value?.toString() ?? ""}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="border border-gray-300 rounded-md px-3 py-2 w-[80px]"
                  >
                    {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* Imagem - OPCIONAL */}
      {showImagem && (
        <FormField
          control={form.control}
          name={"imagem" as Path<T>}
          render={({ field }) => (
            <FormItem className="flex items-start gap-8">
              <Label className="text-gray-900 font-medium text-lg w-28 mt-2">{imagemLabel}:</Label>
              <div className="flex-1">
                <FormControl>
                  <div className="relative">
                    <input
                      name="imagem"
                      type="file"
                      ref={fileInputRef}
                      accept="image/jpeg,image/png"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          field.onChange(file)
                          handlePreview(file)
                        }
                      }}
                      className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                    />
                    <ImageIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                </FormControl>
                <p className="text-blue-600 font-medium mt-2 text-sm">(JPG/PNG 1920x750px)</p>
                {previewImage && (
                  <img
                    src={previewImage}
                    alt="Pré-visualização"
                    className="mt-4 rounded-lg shadow-sm border border-gray-300 max-h-48 object-cover"
                  />
                )}
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
      )}

      {/* Título - SEMPRE */}
      <FormField
        control={form.control}
        name={"titulo" as Path<T>}
        render={({ field }) => (
          <FormItem className="flex items-center gap-8">
            <Label className="text-gray-900 font-medium text-lg w-28">Título:</Label>
            <FormControl>
              <Input
                placeholder="Digite o título"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Subtítulo - OPCIONAL */}
      {showSubtitulo && (
        <FormField
          control={form.control}
          name={"subtitulo" as Path<T>}
          render={({ field }) => (
            <FormItem className="flex items-center gap-8">
              <Label className="text-gray-900 font-medium text-lg w-28">Subtítulo:</Label>
              <FormControl>
                <Input
                  placeholder="Digite o subtítulo"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* URL - SEMPRE */}
      <FormField
        control={form.control}
        name={"url" as Path<T>}
        render={({ field }) => (
          <FormItem className="flex items-start gap-8">
            <div className="w-28">
              <Label className="text-gray-900 font-medium text-lg">URL:</Label>
              <p className="text-blue-600 font-medium mt-1 text-sm">(com https://)</p>
            </div>
            <FormControl>
              <Textarea
                placeholder="Digite a URL de destino"
                className="min-h-32"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}
