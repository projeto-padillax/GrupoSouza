"use client";

import { JSX, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createFormulario } from "@/lib/actions/formularios";

const schema = z.object({
    nome: z.string().min(1, "Informe seu nome"),
    email: z.email("Email inválido"),
    telefone: z.string().min(8, "Informe um número válido"),
    endereco: z.string().min(3, "Informe o endereço"),
    bairro: z.string().min(1, "Informe o bairro"),
    cidade: z.string().min(1, "Informe a cidade"),
    finalidade: z.enum(["ALUGUEL", "VENDA"], "Escolha a finalidade do anuncio"),
    valorDesejado: z
        .number("Insira apenas números")
        .positive("Número deve ser positivo"),
    descricao: z.string().min(5, "Descreva brevemente o imóvel"),
});

type FormData = z.infer<typeof schema>;

export default function AnuncieForm(): JSX.Element {
    const [isPending, startTransition] = useTransition();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = (data: FormData) => {
        startTransition(async () => {
            try {
                const resumo = [
                    `Novo anúncio de imóvel`,
                    `Nome: ${data.nome}`,
                    `Telefone: ${data.telefone}`,
                    `Email: ${data.email}`,
                    `Endereço: ${data.endereco}, Bairro: ${data.bairro}, Cidade: ${data.cidade}`,
                    `Finalidade: ${data.finalidade}`,
                    data.valorDesejado ? `Valor desejado: R$ ${data.valorDesejado}` : null,
                    `Descrição: ${data.descricao}`,
                ]
                    .filter(Boolean)
                    .join(" | ");

                await createFormulario({
                    tipo: "ANUNCIEIMOVEL",
                    nome: data.nome,
                    email: data.email,
                    telefone: data.telefone,
                    mensagem: resumo,
                    urlRespondida: typeof window !== "undefined" ? window.location.href : "",
                    finalidade: data.finalidade,
                    valorDesejado: data.valorDesejado,
                });

                toast.success("Enviado com sucesso! Em breve entraremos em contato.");
                reset();
            } catch (e) {
                console.error(e);
                toast.error("Não foi possível enviar. Tente novamente.");
            }
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                    <input {...register("nome")} placeholder="Nome" className="w-full border rounded-md px-3 py-2" />
                    {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome.message}</p>}
                </div>
                <div>
                    <input {...register("email")} placeholder="E-mail" className="w-full border rounded-md px-3 py-2" />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                    <input {...register("telefone")} placeholder="Telefone" className="w-full border rounded-md px-3 py-2" />
                    {errors.telefone && <p className="text-red-500 text-xs mt-1">{errors.telefone.message}</p>}
                </div>
                <div>
                    <input {...register("endereco")} placeholder="Endereço Completo" className="w-full border rounded-md px-3 py-2" />
                    {errors.endereco && <p className="text-red-500 text-xs mt-1">{errors.endereco.message}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                    <input {...register("bairro")} placeholder="Bairro" className="w-full border rounded-md px-3 py-2" />
                    {errors.bairro && <p className="text-red-500 text-xs mt-1">{errors.bairro.message}</p>}
                </div>
                <div>
                    <input {...register("cidade")} placeholder="Cidade" className="w-full border rounded-md px-3 py-2" />
                    {errors.cidade && <p className="text-red-500 text-xs mt-1">{errors.cidade.message}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                    <select {...register("finalidade")} className="w-full border rounded-md px-3 py-2 bg-white" defaultValue="">
                        <option value="" disabled>Finalidade</option>
                        <option value="ALUGUEL">Aluguel</option>
                        <option value="VENDA">Venda</option>
                        <option value="VENDA E ALUGUEL">Venda e Aluguel</option>
                    </select>
                    {errors.finalidade && <p className="text-red-500 text-xs mt-1">{errors.finalidade.message}</p>}
                </div>
                <div>
                    <div className="flex items-center border rounded-md px-3 py-2 bg-white">
                        <span className="text-gray-500 mr-1">R$</span>
                        <input
                            type="number"
                            {...register("valorDesejado", { valueAsNumber: true })}
                            placeholder="0"
                            className="w-full outline-none"
                        />
                    </div>
                    {errors.valorDesejado && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.valorDesejado.message?.toString()}
                        </p>
                    )}
                </div>
            </div>

            <div>
                <textarea
                    {...register("descricao")}
                    placeholder="Descreva brevemente o imóvel."
                    className="w-full border rounded-md px-3 py-2 resize-none min-h-[110px]"
                />
                {errors.descricao && <p className="text-red-500 text-xs mt-1">{errors.descricao.message}</p>}
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="w-full bg-[#0d2a57] hover:bg-[#0b2146] text-white font-medium py-3 rounded-md transition"
            >
                {isPending ? "Enviando..." : "ENVIAR"}
            </button>
        </form>
    );
}
