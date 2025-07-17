"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Form } from "@/components/ui/form";
import { Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { createSlide, updateSlide } from "@/lib/actions/slide";
import { FormFields } from "@/components/admin/formFields";
import { Slides as SlideORM } from "@prisma/client";

// Schema unificado
const slideSchema = z.object({
    status: z.boolean(),
    imagem: z.string().url("O banner é obrigatório."),
    titulo: z
        .string()
        .min(1, "Título é obrigatório.")
        .max(100, "Título deve ter no máximo 100 caracteres."),
    ordem: z.number().int().positive().max(999),
    url: z
        .string()
        .min(1, "URL é obrigatória.")
        .url("URL inválida.")
        .refine(
            (url) => url.startsWith("https://"),
            { message: "URL deve começar com https://" }
        ),
});

export type SlideInput = z.infer<typeof slideSchema>;

interface SlideFormProps {
    slide?: SlideORM; // Opcional - se não existir, é criação
    mode: "create" | "edit";
}

export default function SlideForm({ slide, mode }: SlideFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [previewImage, setPreviewImage] = useState<string>(
        slide?.imagem || ""
    );
    console.log(previewImage)

    const isEditing = mode === "edit" && slide;
    const pageTitle = isEditing ? "Editar Slide" : "Novo Slide na Home";
    const pageSubtitle = isEditing 
        ? `Edite as informações do slide #${slide.ordem}` 
        : "Crie um novo slide para a página inicial";

    const form = useForm<SlideInput>({
        resolver: zodResolver(slideSchema),
        defaultValues: {
            status: slide?.status ?? true,
            imagem: slide?.imagem ?? "",
            titulo: slide?.titulo ?? "",
            ordem: slide?.ordem ?? 1,
            url: slide?.url ?? "",
        },
    });

    const onSubmit = (values: SlideInput) => {
        startTransition(async () => {
            try {
                if (isEditing) {
                    await updateSlide({
                        ...values,
                        id: slide.id,
                    });
                    toast.success("Slide editado com sucesso!");
                } else {
                    const slideData = {
                        ...values,
                    };
                    await createSlide(slideData);
                    toast.success("Slide criado com sucesso!");
                }
                
                router.push("/admin/slides");
            } catch (error) {
                console.error(error);
                const errorMessage = error instanceof Error 
                    ? error.message 
                    : `Erro ao ${isEditing ? 'editar' : 'criar'} slide`;
                toast.error(errorMessage);
            }
        });
    };

    const handleBack = () => {
        router.replace("/admin/slides");
    };

    return (
        <main className="py-12">
            <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10">
                <div className="mb-8">
                    <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
                        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                            {pageTitle}
                        </h1>
                        <p className="text-lg text-gray-600">
                            {pageSubtitle}
                        </p>
                    </div>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <Card>
                            <CardContent className="p-8 space-y-8">
                                <FormFields
                                    form={form}
                                    previewImage={previewImage ?? ""}
                                    setPreviewImage={setPreviewImage}
                                    showOrdenacao
                                    showImagem
                                    imagemLabel="Slide"
                                />
                            </CardContent>
                        </Card>
                        
                        {/* Buttons */}
                        <Card className="border border-gray-200 rounded-xl shadow-sm bg-white mt-6">
                            <CardContent className="p-6">
                                <div className="flex gap-4">
                                    <Button 
                                        type="submit" 
                                        size="lg"
                                        disabled={isPending}
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
                    </form>
                </Form>
            </div>
        </main>
    );
}