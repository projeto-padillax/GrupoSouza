"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Save, ArrowLeft } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"

import { Corretor as CorretorORM } from "@prisma/client"
import { createCorretor, updateCorretor } from "@/lib/actions/corretores"

import z from "zod"
import { CorretorFormFields } from "./corretorFormField"

const corretorSchema = z.object({
    status: z.boolean(),
    name: z.string().min(1, "Nome é obrigatório."),
    email: z.email("Email inválido."),
    telefone: z.string().min(8, "Telefone é obrigatório."),
    CRECI: z.string().min(1, "CRECI é obrigatório."),
})

export type CorretorInput = z.infer<typeof corretorSchema>

type CorretorFormProps = {
    corretor?: CorretorORM
}

export default function CorretorForm({ corretor }: CorretorFormProps) {
    const router = useRouter()

    const form = useForm<CorretorInput>({
        resolver: zodResolver(corretorSchema),
        defaultValues: {
            status: corretor?.status ?? true,
            name: corretor?.name ?? "",
            email: corretor?.email ?? "",
            telefone: corretor?.telefone ?? "",
            CRECI: corretor?.CRECI ?? "",
        },
    })

    const onSubmit = async (values: CorretorInput) => {
        try {
            if (!corretor) {
                await createCorretor(values);
            } else {
                await updateCorretor({
                    ...values,
                    id: corretor!.id,
                });
            }
            router.push("/admin/corretores");
            toast.success("Corretor editado com sucesso!");
        } catch (error) {
            console.error(error);
            toast.error("Erro ao editar corretor, tente novamente mais tarde!");
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Card>
                    <CardContent className="p-8 space-y-8">
                        <CorretorFormFields form={form} />
                    </CardContent>
                </Card>

                <Card className="border border-gray-200 rounded-xl shadow-sm bg-white">
                    <CardContent className="p-6 flex gap-4">
                        <Button type="submit" size="lg">
                            <Save className="h-4 w-4 mr-2" />
                            Salvar
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.replace("/admin/corretores")}
                            size="lg"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Voltar
                        </Button>
                    </CardContent>
                </Card>
            </form>
        </Form>
    )
}
