"use client";

import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { Save, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Banners as BannerORM } from "@prisma/client";
import { FormFields } from "./formFields";
import { updateBanner } from "@/lib/actions/banner";

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

type BannerFormProps = {
  banner: BannerORM
};

export default function EditBannerClient({ banner }: BannerFormProps) {
  const [previewImage, setPreviewImage] = useState<string>(banner.imagem || "/hero-house.jpg");

  const form = useForm<BannerInput>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      ...banner,
      imagem: "placeholder.jpg", // TEMPORARY: replace later with actual upload
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
      await updateBanner({
        ...values,
        id: banner.id,
      });
      toast.success("Banner editado com sucesso!");
      // window.location.href = "/admin/banners";
    } catch (error) {
      console.error(error);
      toast.error("Erro ao editar banner, tente novamente mais tarde!");
    }
  };

  return (
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
  );
}
