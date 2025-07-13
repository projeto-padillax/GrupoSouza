"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Save, ArrowLeft, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { createBanner } from "@/lib/actions/banner";

const bannerSchema = z.object({
  status: z.enum(["ativo", "inativo"]),
  imagem: z
    .any()
    .refine((file) => file instanceof File, {
      message: "O banner é obrigatório.",
    }),
  titulo: z.string().min(1, "Título é obrigatório."),
  subtitulo: z.string().min(1, "Subtítulo é obrigatório."),
  url: z.string().url("URL inválida (deve começar com https://)."),
});

export type BannerInput = z.infer<typeof bannerSchema>;

export default function NovoBannerPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string>("");

  const form = useForm<BannerInput>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      status: "ativo",
      imagem: undefined,
      titulo: "",
      subtitulo: "",
      url: "",
    },
  });

  const handlePreview = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreviewImage(result);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (values: BannerInput) => {
    try {
      await createBanner(values);
      window.location.href = "/admin/banners";
      toast.success("Banner criado com sucesso!");
    } catch(error) {
      console.error(error)
      toast.error("Erro ao salvar banner.");
    }
  };

  return (
    <main className="py-12">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">
              Novo Banner na Home
            </h1>
            <p className="text-lg text-gray-600">
              Crie um novo banner para a página inicial
            </p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card className="border border-gray-200 rounded-xl shadow-sm bg-white">
              <CardContent className="p-8 space-y-8">
                {/* Status */}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-8">
                      <Label className="text-gray-900 font-medium text-lg w-28">
                        Status:
                      </Label>
                      <FormControl>
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="flex gap-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="ativo"
                              id="ativo"
                              className="scale-110"
                            />
                            <Label
                              htmlFor="ativo"
                              className="text-gray-700 text-base font-medium"
                            >
                              Ativo
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="inativo"
                              id="inativo"
                              className="scale-110"
                            />
                            <Label
                              htmlFor="inativo"
                              className="text-gray-700 text-base font-medium"
                            >
                              Inativo
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Banner Image */}
                <FormField
                  control={form.control}
                  name="imagem"
                  render={({ field }) => (
                    <FormItem className="flex items-start gap-8">
                      <Label className="text-gray-900 font-medium text-lg w-28 mt-2">
                        Banner:
                      </Label>
                      <div className="flex-1">
                        <FormControl>
                          <div className="relative">
                            <input
                              name="imagem"
                              type="file"
                              ref={fileInputRef}
                              accept="image/jpeg,image/png"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  field.onChange(file);
                                  handlePreview(file);
                                }
                              }}
                              className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                            />
                            <ImageIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                          </div>
                        </FormControl>
                        <p className="text-blue-600 font-medium mt-2 text-sm">
                          (JPG/PNG 1920x750px)
                        </p>
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

                {/* Título */}
                <FormField
                  control={form.control}
                  name="titulo"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-8">
                      <Label className="text-gray-900 font-medium text-lg w-28">
                        Título:
                      </Label>
                      <FormControl>
                        <Input
                          placeholder="Digite o título do banner"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Subtítulo */}
                <FormField
                  control={form.control}
                  name="subtitulo"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-8">
                      <Label className="text-gray-900 font-medium text-lg w-28">
                        Subtítulo:
                      </Label>
                      <FormControl>
                        <Input
                          placeholder="Digite o subtítulo do banner"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* URL */}
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem className="flex items-start gap-8">
                      <div className="w-28">
                        <Label className="text-gray-900 font-medium text-lg">
                          URL:
                        </Label>
                        <p className="text-blue-600 font-medium mt-1 text-sm">
                          (com https://)
                        </p>
                      </div>
                      <FormControl>
                        <Textarea
                          placeholder="Digite a URL de destino do banner"
                          className="min-h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Buttons */}
            <Card className="border border-gray-200 rounded-xl shadow-sm bg-white mt-6">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <Button type="submit" size="lg">
                    <Save className="h-4 w-4 mr-2" />
                    Salvar
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      (window.location.href = "/admin/banners")
                    }
                    size="lg"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
    </main>
  );
}