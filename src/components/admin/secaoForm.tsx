"use client"

import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Save, ArrowLeft, ImageIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PaginasConteudo } from "@prisma/client";
import { useRouter } from "next/navigation";
import { createPagina, updatePagina } from "@/lib/actions/contentPages";
import { CldUploadWidget } from "next-cloudinary";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import Image from "next/image";
import { Secao } from "@/lib/types/secao";

const SecaoZod = z.object({
  sitemap: z.boolean(),
  editarTextoFundo: z.boolean(),
  // ordem: z.number().min(0, "Ordem deve ser positiva."),
  // imagem: z.string().optional(),
  titulo: z
    .string()
    .min(1, "Título é obrigatório.")
    .max(100, "Título deve ter no máximo 100 caracteres."),
  descricao: z
    .string()
    .min(1, "Descrição é obrigatória.")
    .max(255, "A descrição deve ter no máximo 255 caracteres."),
  palavrasChave: z
    .string()
    .min(1, "Palavras Chaves são obrigatórias.")
    .max(100, "As palavras chaves deve ter no máximo 255 caracteres."),
  url: z.string(),
  // publicId: z.string().optional(),
  // conteudo: z.string().optional(),
});

export type SecaoInput = z.infer<typeof SecaoZod>;

interface SecaoFormProps {
  secao: Secao;
  mode: "edit";
}

export default function SecaoForm({
  secao,
  mode,
}: SecaoFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  // const [previewImage, setPreviewImage] = useState<string>(
  //   paginaDeConteudo?.imagem ?? ""
  // );

  const isEditing = mode === "edit";

  const form = useForm<SecaoInput>({
    resolver: zodResolver(SecaoZod),
    defaultValues: {
      sitemap: secao?.sitemap ?? true,
      editarTextoFundo: secao?.sitemap ?? false,
      url: secao?.url ?? "",
      titulo: secao?.titulo ?? "",
      descricao: secao?.descricao ?? "",
      palavrasChave: secao?.palavrasChave ?? "",
      // ordem: secao?.ordem ?? 1,
      // imagem: secao?.imagem ?? "",
      // publicId: paginaDeConteudo?.publicId ?? "",
    },
  });

  const formatPageUrl = (titulo: string) => {
    return `${process.env.NEXT_PUBLIC_BASE_URL || ""}/pagina/${encodeURIComponent(titulo.toLowerCase())}`;
  };

  const onSubmit = (values: SecaoInput) => {
    startTransition(async () => {
      try {
        // Limpar campos não utilizados baseado no tipo

        // if (isEditing) {
        //   await updatePagina(paginaDeConteudo.id, dataToSubmit);
        //   toast.success("Página editada com sucesso!");
        // } else {
        //   console.log("URL que vai ser salva:", dataToSubmit.url);
        //   await createPagina(dataToSubmit);
        //   toast.success("Página criada com sucesso!" + dataToSubmit.url);
        // }

        router.push("/admin/secoes");
      } catch (error) {
        console.error(error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : `Erro ao editar página`;
        toast.error(errorMessage);
      }
    });
  };

  const handleBack = () => {
    router.push("/admin/paginas");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardContent className="p-8 space-y-8">
            <div className="space-y-6">
              {/* All your FormField components */}
              <FormField
                control={form.control}
                name="sitemap"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-8">
                    <Label className="text-gray-900 font-medium text-lg w-28">
                      Exibir no Sitemap:
                    </Label>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) =>
                          field.onChange(value === "true")
                        }
                        value={field.value ? "true" : "false"}
                        className="flex items-center space-x-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="true" id="exibir-sitemap-sim" />
                          <Label
                            htmlFor="exibir-sitemap-sim"
                            className="text-gray-700 text-base font-medium cursor-pointer"
                          >
                            Sim
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="false" id="exibir-sitemap-nao" />
                          <Label
                            htmlFor="exibir-sitemap-nao"
                            className="text-gray-700 text-base font-medium cursor-pointer"
                          >
                            Não
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="titulo"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-8">
                    <Label className="text-gray-900 font-medium text-lg w-28">
                      Título:
                    </Label>
                    <FormControl>
                      <Input placeholder="Digite o título da seção" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem className="flex items-start gap-8">
                    <Label className="text-gray-900 font-medium text-lg w-28 mt-2">
                      Descrição da Página:
                    </Label>
                    <FormControl>
                      <Textarea
                        placeholder="Digite a descrição da página para Google/SEO"
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="palavrasChave"
                render={({ field }) => (
                  <FormItem className="flex items-start gap-8">
                    <Label className="text-gray-900 font-medium text-lg w-28 mt-2">
                      Palavras Chaves:
                    </Label>
                    <FormControl>
                      <Textarea
                        placeholder="Palavras Chaves minúsculas e separadas por vírgula"
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>

            {/* Buttons */}
            <Card className="border border-gray-200 rounded-xl shadow-sm bg-white mt-6">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isPending}
                    className="cursor-pointer"
                  >
                    {isPending ? (
                      <>
                        <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        {isEditing ? "Salvando..." : "Criando..."}
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {isEditing ? "Salvar" : "Criar"}
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    className="cursor-pointer"
                    variant="outline"
                    onClick={handleBack}
                    size="lg"
                    disabled={isPending}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}