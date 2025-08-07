'use client'

import { CalendarDays, SendHorizonal, ChevronRight, ChevronLeft } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { format, addDays, isSaturday, isSunday } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { createFormulario } from '@/lib/actions/formularios'

const formSchema = z.object({
    nome: z.string().min(2, 'Informe seu nome'),
    celular: z.string().min(8, 'Informe um número válido'),
    email: z.email('E-mail inválido'),
    data: z.date(),
})

interface AgendamentoFormProps {
  codigo: string
}

type FormData = z.infer<typeof formSchema>

function getDiasUteis(inicio: Date, qtd: number) {
    const datas: Date[] = []
    let dia = inicio

    while (datas.length < qtd) {
        if (!isSaturday(dia) && !isSunday(dia)) {
            datas.push(dia)
        }
        dia = addDays(dia, 1)
    }

    return datas
}

export default function AgendamentoForm({ codigo }: AgendamentoFormProps) {
    const [startOffset, setStartOffset] = useState(1)
    const datas = getDiasUteis(addDays(new Date(), startOffset), 7)
    const [dataSelecionada, setDataSelecionada] = useState<Date>(datas[0])
    const [isPending, startTransition] = useTransition()

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            data: datas[0],
        },
    })

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
                    origem: "ORGANICO",
                    codigoImovel: codigo,
                });

                toast.success("Agendamento enviado com sucesso!");

                reset({
                    nome: "",
                    celular: "",
                    email: "",
                    data: datas[0],
                });

                setDataSelecionada(datas[0]);
            } catch (err) {
                console.error(err);
                toast.error("Erro ao enviar agendamento.");
            }
        });
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-800">
                    <CalendarDays className="w-5 h-5 text-[#4f7dc3]" />
                    Agendar Visita
                </h2>
                <p className="text-sm text-gray-500">Escolha uma data e preencha seus dados</p>
            </div>

            {/* Navegação por datas */}
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => setStartOffset((prev) => Math.max(prev - 5, 1))}
                    className="p-1 border rounded hover:bg-gray-100"
                >
                    <ChevronLeft size={18} />
                </button>

                <div className="flex gap-2 overflow-x-auto pb-1">
                    {datas.map((data, idx) => {
                        const dia = format(data, 'EEEE', { locale: ptBR })
                        const dataFormatada = format(data, 'dd/MM')
                        const isSelecionado = dataSelecionada.toDateString() === data.toDateString()

                        return (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                    setDataSelecionada(data)
                                    setValue('data', data)
                                }}
                                className={`min-w-[80px] text-center rounded-md border px-2 py-1 text-sm ${isSelecionado
                                        ? 'bg-[#4f7dc3] text-white border-[#4f7dc3]'
                                        : 'text-gray-700 border-gray-300 hover:bg-gray-100'
                                    }`}
                            >
                                <div className="capitalize">{dia}</div>
                                <div>{dataFormatada}</div>
                            </button>
                        )
                    })}
                </div>

                <button
                    type="button"
                    onClick={() => setStartOffset((prev) => prev + 5)}
                    className="p-1 border rounded hover:bg-gray-100"
                >
                    <ChevronRight size={18} />
                </button>
            </div>

            {/* Formulário */}
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-2"
            >
                <div>
                    <input
                        {...register('nome')}
                        placeholder="Nome"
                        className="border rounded-md px-3 py-2 text-sm text-gray-800 w-full"
                    />
                    {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome.message}</p>}
                </div>

                <div>
                    <input
                        {...register('celular')}
                        placeholder="Celular"
                        className="border rounded-md px-3 py-2 text-sm text-gray-800 w-full"
                    />
                    {errors.celular && <p className="text-red-500 text-xs mt-1">{errors.celular.message}</p>}
                </div>

                <div className="flex gap-2">
                    <div className="flex-1">
                        <input
                            {...register('email')}
                            placeholder="E-mail"
                            className="border rounded-md px-3 py-2 text-sm text-gray-800 w-full"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="bg-[#4f7dc3] hover:bg-[#41659c] text-white px-4 py-2 rounded-md"
                    >
                        {isPending ? (
                            <div className="h-4 w-4 animate-spin border-2 border-white border-t-transparent rounded-full" />
                        ) : (
                            <SendHorizonal className="w-4 h-4" />
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}
