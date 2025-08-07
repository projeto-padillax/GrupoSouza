"use client";

import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays, isSaturday, isSunday, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEffect, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import clsx from "clsx";
import { createFormulario } from "@/lib/actions/formularios";

const schema = z.object({
    nome: z.string().min(2, "Informe seu nome"),
    email: z.email('E-mail inválido'),
    celular: z.string().min(8, "Informe um número válido"),
    data: z.date(),
    mensagem: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

function getDiasUteis(inicio: Date, qtd: number) {
    const datas: Date[] = [];
    let d = inicio;
    while (datas.length < qtd) {
        if (!isSaturday(d) && !isSunday(d)) datas.push(d);
        d = addDays(d, 1);
    }
    return datas;
}

interface AgendamentoModalProps {
    open: boolean;
    onClose: () => void;
    codigoImovel: string;
}

export default function AgendamentoModal({ open, onClose, codigoImovel }: AgendamentoModalProps) {
    const [isPending, startTransition] = useTransition();

    // paginação de datas (começa em amanhã)
    const [startOffset, setStartOffset] = useState(1);
    const datas = useMemo(() => getDiasUteis(addDays(new Date(), startOffset), 6), [startOffset]);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            nome: "",
            email: "",
            celular: "",
            data: datas[0],
            mensagem: "",
        },
    });

    const [dataSelecionada, setDataSelecionada] = useState<Date>(datas[0]);

    useEffect(() => {
        if (datas[0]) {
            setDataSelecionada(datas[0]);
            setValue("data", datas[0]);
        }
    }, [datas, setValue]);

    if (!open) return null;

    const onSubmit = (data: FormData) => {
        startTransition(async () => {
            try {
                await createFormulario({
                    tipo: "VISITA",
                    nome: data.nome,
                    email: data.email,
                    telefone: data.celular,
                    urlRespondida: window.location.href,
                    DataVisita: data.data,
                    mensagem: data.mensagem,
                    origem: "ORGANICO",
                    codigoImovel,
                });

                toast.success("Agendamento enviado com sucesso!");
                reset({ nome: "", email: "", celular: "", data: datas[0], mensagem: "" });
                onClose();
            } catch (e) {
                console.error(e);
                toast.error("Erro ao enviar agendamento.");
            }
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 px-4">
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
                <button onClick={onClose} className="absolute right-4 top-4">
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-center text-2xl font-extrabold mb-4">Solicitar Visita</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    {/* Inputs */}
                    <div>
                        <input
                            {...register("nome")}
                            placeholder="Nome"
                            className="w-full rounded-md bg-gray-100 px-3 py-2 text-sm outline-none"
                        />
                        {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome.message}</p>}
                    </div>

                    <div>
                        <input
                            {...register("email")}
                            placeholder="E-mail"
                            className="w-full rounded-md bg-gray-100 px-3 py-2 text-sm outline-none"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                        <input
                            {...register("celular")}
                            placeholder="Telefone"
                            className="w-full rounded-md bg-gray-100 px-3 py-2 text-sm outline-none"
                        />
                        {errors.celular && <p className="text-red-500 text-xs mt-1">{errors.celular.message}</p>}
                    </div>

                    <div className="pt-1">
                        <p className="font-semibold text-sm">Datas</p>
                        <p className="text-xs text-gray-500 mb-2">Escolha uma das datas.</p>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setStartOffset((v) => Math.max(1, v - 8))}
                                className="p-2 rounded-md border border-gray-300 hover:bg-gray-50"
                                aria-label="Datas anteriores"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>

                            <div className="grid grid-cols-3 gap-2 flex-1">
                                {datas.map((data, idx) => {
                                    const diaSemana = format(data, "EEEE", { locale: ptBR });
                                    const dia = format(data, "dd/MM");
                                    const selecionado = dataSelecionada.toDateString() === data.toDateString();
                                    return (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => {
                                                setDataSelecionada(data);
                                                setValue("data", data);
                                            }}
                                            className={clsx(
                                                "rounded-md border px-2 py-2 text-center transition",
                                                "text-sm leading-tight",
                                                selecionado
                                                    ? "bg-[#1c78ff] text-white border-[#1c78ff] shadow"
                                                    : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
                                            )}
                                        >
                                            <div className="capitalize text-xs">{diaSemana}</div>
                                            <div className="text-base font-semibold">{dia}</div>
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                type="button"
                                onClick={() => setStartOffset((v) => v + 8)}
                                className="p-2 rounded-md border border-gray-300 hover:bg-gray-50"
                                aria-label="Próximas datas"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        {errors.data && <p className="text-red-500 text-xs mt-1">{errors.data.message}</p>}
                    </div>

                    {/* Mensagem */}
                    <div>
                        <textarea
                            {...register("mensagem")}
                            placeholder="Mensagem"
                            className="w-full min-h-[90px] rounded-md bg-gray-100 px-3 py-2 text-sm outline-none resize-none"
                        />
                    </div>

                    {/* Enviar */}
                    <button
                        type="submit"
                        disabled={isPending}
                        className={clsx(
                            "w-full rounded-md py-3 font-bold text-white transition",
                            isPending ? "bg-[#0b2a55]" : "bg-[#0a2a55] hover:brightness-110"
                        )}
                    >
                        {isPending ? "Enviando..." : "ENVIAR"}
                    </button>
                </form>
            </div>
        </div>
    );
}
