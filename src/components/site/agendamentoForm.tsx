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
        if (!isSaturday(dia) && !isSunday(dia)) datas.push(dia)
        dia = addDays(dia, 1)
    }
    return datas
}

function labelDia(date: Date) {
    const full = format(date, 'EEEE', { locale: ptBR })
    const semFeira = full.replace(/-feira/i, '')
    return semFeira.trim().toLocaleUpperCase('pt-BR')
}

export default function AgendamentoForm({ codigo }: AgendamentoFormProps) {
    const [startOffset, setStartOffset] = useState(1)
    const datas = getDiasUteis(addDays(new Date(), startOffset), 8)
    const [dataSelecionada, setDataSelecionada] = useState<Date>(datas[0])
    const [isPending, startTransition] = useTransition()
    const canGoBack = startOffset > 1
    const canGoForward = startOffset + 5 <= 14

    const { register, handleSubmit, setValue, reset, formState: { errors } } =
        useForm<FormData>({
            resolver: zodResolver(formSchema),
            defaultValues: { data: datas[0] },
        })

    const onSubmit = (data: FormData) => {
        startTransition(async () => {
            try {
                await createFormulario({
                    tipo: 'VISITA',
                    nome: data.nome,
                    email: data.email,
                    telefone: data.celular,
                    urlRespondida: window.location.href,
                    DataVisita: data.data,
                    origem: 'ORGANICO',
                    codigoImovel: codigo,
                })
                toast.success('Agendamento enviado com sucesso!')
                reset({ nome: '', celular: '', email: '', data: datas[0] })
                setDataSelecionada(datas[0])
            } catch {
                toast.error('Erro ao enviar agendamento.')
            }
        })
    }

    return (
        <div className="space-y-4">
            <div>
                <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-800">
                    <CalendarDays className="w-5 h-5 text-[#4f7dc3]" />
                    Agendar visita
                </h2>
                <p className="text-sm text-black">
                    Escolha a data e aguarde a confirmação de nossa equipe.
                </p>
            </div>

            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => setStartOffset((prev) => Math.max(prev - 5, 1))}
                    className={[
                        "shrink-0 rounded-xl border border-gray-400 px-2 py-2 hover:bg-gray-50",
                        canGoBack ? "" : "invisible"
                    ].join(" ")}
                    aria-label="Voltar datas"
                >
                    <ChevronLeft size={16} />
                </button>

                <div className="flex gap-2 overflow-x-auto pb-1">
                    {datas.map((data, idx) => {
                        const dia = labelDia(data)
                        const dataFormatada = format(data, 'dd/MM')
                        const isSelecionado = dataSelecionada.toDateString() === data.toDateString()
                        return (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => { setDataSelecionada(data); setValue('data', data) }}
                                className={[
                                    'min-w-[80px] rounded-md px-3 py-2 text-[12px] text-center font-semibold',
                                    'border transition-colors',
                                    isSelecionado
                                        ? 'bg-[#4f7dc3] border-[#4f7dc3] text-white'
                                        : 'bg-white border-gray-400 text-gray-800 hover:bg-gray-50'
                                ].join(' ')}
                            >
                                <div className="leading-4">{dia}</div>
                                <div className="mt-1 font-medium font-semibold text-[15px]">{dataFormatada}</div>
                            </button>
                        )
                    })}
                </div>

                <button
                    type="button"
                    onClick={() => setStartOffset((prev) => Math.min(prev + 5, 14))}
                    className={[
                        "shrink-0 rounded-xl border border-gray-400 px-2 py-2 hover:bg-gray-50",
                        canGoForward ? "" : "invisible"
                    ].join(" ")}
                    aria-label="Avançar datas"
                >
                    <ChevronRight size={16} />
                </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-2">
                <div className="relative">
                    <label className="absolute left-3 top-1.5 text-[12px] font-semibold text-black pointer-events-none">
                        NOME
                    </label>
                    <input
                        {...register('nome')}
                        className="w-full rounded-md border border-gray-400 bg-white px-3 pt-5 pb-2 text-sm text-gray-900
                 focus:border-[#4f7dc3] focus:outline-none focus:ring-2 focus:ring-[#4f7dc3]/20"
                    />
                    {errors.nome && <p className="mt-1 text-xs text-red-500">{errors.nome.message}</p>}
                </div>

                <div className="relative">
                    <label className="absolute left-3 top-1.5 text-[12px] font-semibold text-black pointer-events-none">
                        CELULAR
                    </label>
                    <input
                        {...register('celular')}
                        className="w-full rounded-md border border-gray-400 bg-white px-3 pt-5 pb-2 text-sm text-gray-900
                 focus:border-[#4f7dc3] focus:outline-none focus:ring-2 focus:ring-[#4f7dc3]/20"
                    />
                    {errors.celular && <p className="mt-1 text-xs text-red-500">{errors.celular.message}</p>}
                </div>

                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <label className="absolute left-3 top-1.5 text-[12px] font-semibold text-black pointer-events-none">
                            E-MAIL
                        </label>
                        <input
                            {...register('email')}
                            className="w-full rounded-md border border-gray-400 bg-white px-3 pt-5 pb-2 text-sm text-gray-900
                   focus:border-[#4f7dc3] focus:outline-none focus:ring-2 focus:ring-[#4f7dc3]/20"
                        />
                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="grid place-items-center rounded-xl bg-[#4f7dc3] px-4 py-3 text-white hover:bg-[#41659c] disabled:opacity-70"
                    >
                        {isPending
                            ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            : <SendHorizonal className="h-4 w-4" />
                        }
                    </button>
                </div>
            </form>
        </div>
    )
}
