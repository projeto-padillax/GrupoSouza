"use client"

import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
} from "@/components/ui/form";
import { Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { createBanner } from "@/lib/actions/banner";
import { FormFields } from "@/components/admin/formFields";

const bannerSchema = z.object({
  status: z.boolean(),
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
  const [previewImage, setPreviewImage] = useState<string>("");

  const form = useForm<BannerInput>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      status: true,
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
    } catch (error) {
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
            <Card>
              <CardContent className="p-8 space-y-8">
                <FormFields
                  form={form}
                  previewImage={previewImage}
                  setPreviewImage={setPreviewImage}
                  showSubtitulo
                  showImagem
                  imagemLabel="Banner"
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