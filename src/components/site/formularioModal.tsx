"use client";

import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { toast } from "sonner";
import clsx from "clsx";
import { createFormulario } from "@/lib/actions/formularios";

interface FormularioModalProps {
    open: boolean;
    onClose: () => void;
    tipo: "whatsapp" | "financiamento";
    valorImovel?: number;
    codigoImovel: string;
}

export default function FormularioModal({
    open,
    onClose,
    tipo,
    valorImovel,
    codigoImovel,
}: FormularioModalProps) {
    const schema = z
        .object({
            nome: z.string().min(1, "Nome obrigatório"),
            email: z.email("Email inválido"),
            celular: z.string().min(1, "Celular obrigatório"),
            mensagem: z.string().optional(),
            valorEntrada: z.number("Digite um número válido").optional(),
        }).refine(
            (data) => tipo !== "financiamento" || typeof data.valorEntrada === "number",
            { message: "Valor de entrada é obrigatório", path: ["valorEntrada"] }
        );

    type FormInput = z.infer<typeof schema>;

    const [isPending, startTransition] = useTransition();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormInput>({
        resolver: zodResolver(schema),
    });

    const onSubmit = (data: FormInput) => {
        startTransition(async () => {
            try {
                const mensagemFinal =
                    tipo === "financiamento"
                        ? `${data.mensagem ?? ""}\nValor de entrada: ${data.valorEntrada}`
                        : data.mensagem;

                await createFormulario({
                    tipo: tipo === "whatsapp" ? "WHATSAPP" : "FINANCIAMENTO",
                    nome: data.nome,
                    email: data.email,
                    telefone: data.celular,
                    urlRespondida: window.location.href,
                    codigoImovel,
                    mensagem: mensagemFinal,
                });

                toast.success("Enviado com sucesso!");
                reset();
                onClose();
            } catch {
                toast.error("Erro ao enviar.");
            }
        });
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 px-4">
            <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-lg relative">
                <button onClick={onClose} className="absolute top-4 right-4">
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-center font-bold text-xl mb-4">
                    {tipo === "whatsapp" ? "WhatsApp" : "Simular Financiamento"}
                </h2>

                {tipo === "financiamento" && valorImovel !== undefined && (
                    <div className="text-center font-semibold mb-4">
                        <p className="text-sm text-gray-600">Valor do Imóvel</p>
                        <p className="text-lg">R$ {valorImovel.toLocaleString("pt-BR")}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 text-sm">
                    <div>
                        <input
                            {...register("nome")}
                            placeholder="Nome"
                            className="w-full border rounded-md px-3 py-2"
                        />
                        {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome.message}</p>}
                    </div>

                    <div>
                        <input
                            {...register("email")}
                            placeholder="E-mail"
                            className="w-full border rounded-md px-3 py-2"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                        <input
                            {...register("celular")}
                            placeholder="Telefone"
                            className="w-full border rounded-md px-3 py-2"
                        />
                        {errors.celular && (
                            <p className="text-red-500 text-xs mt-1">{errors.celular.message}</p>
                        )}
                    </div>

                    {tipo === "financiamento" && (
                        <>
                            <div>
                                <textarea
                                    {...register("mensagem")}
                                    placeholder="Mensagem"
                                    className="w-full border rounded-md px-3 py-2 resize-none min-h-[80px]"
                                />
                                {errors.mensagem && (
                                    <p className="text-red-500 text-xs mt-1">{errors.mensagem.message}</p>
                                )}
                            </div>

                            <div>
                                <input
                                    {...register("valorEntrada", {
                                        setValueAs: (v) => (v === "" ? undefined : Number(v)),
                                    })}
                                    placeholder="Valor de entrada"
                                    inputMode="numeric"
                                    className="w-full border rounded-md px-3 py-2"
                                />
                                {errors.valorEntrada && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.valorEntrada.message}
                                    </p>
                                )}
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        className={clsx(
                            "w-full text-white font-bold py-2 rounded-md transition",
                            isPending ? "bg-[#3e5fa6]" : "bg-[#4f7dc3] hover:bg-[#3f66a3]"
                        )}
                        disabled={isPending}
                    >
                        {isPending ? "Enviando..." : "ENVIAR"}
                    </button>
                </form>
            </div>
        </div>
    );
}
