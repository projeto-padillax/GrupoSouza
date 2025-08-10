'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { Mail } from 'lucide-react'
import { createFormulario } from '@/lib/actions/formularios'

const schema = z.object({
    nome: z.string().min(1, 'Informe seu nome'),
    celular: z.string().min(8, 'Informe um número válido'),
    email: z.email('Email inválido'),
    mensagem: z.string().min(5),
})

interface MaisInformacoesFormProps {
    codigoImovel: string
}

type FormData = z.infer<typeof schema>

export default function MaisInformacoesForm({ codigoImovel }: MaisInformacoesFormProps) {
    const [isPending, startTransition] = useTransition()

    const defaultMsg = `Gostaria de mais detalhes sobre o imóvel código ${codigoImovel}. Aguardo.`

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            mensagem: defaultMsg,
        },
    })

    const onSubmit = (data: FormData) => {
        startTransition(async () => {
            try {
                await createFormulario({
                    tipo: 'INFORMACOES',
                    nome: data.nome,
                    email: data.email,
                    telefone: data.celular,
                    mensagem: data.mensagem,
                    codigoImovel,
                    urlRespondida: window.location.href,
                })

                toast.success('Mensagem enviada com sucesso!')
                reset({ nome: '', celular: '', email: '', mensagem: defaultMsg })
            } catch (err) {
                console.error(err)
                toast.error('Erro ao enviar mensagem.')
            }
        })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 text-sm">
            <div className="flex gap-2">
                <div className="w-1/2">
                    <input
                        {...register('nome')}
                        placeholder="Nome"
                        className="w-full border rounded-md px-3 py-2"
                    />
                    {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome.message}</p>}
                </div>
                <div className="w-1/2">
                    <input
                        {...register('celular')}
                        placeholder="Celular"
                        className="w-full border rounded-md px-3 py-2"
                    />
                    {errors.celular && <p className="text-red-500 text-xs mt-1">{errors.celular.message}</p>}
                </div>
            </div>

            <div>
                <input
                    {...register('email')}
                    placeholder="Email"
                    className="w-full border rounded-md px-3 py-2"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
                <textarea
                    {...register('mensagem')}
                    className="w-full border rounded-md px-3 py-2 resize-none min-h-[80px]"
                />
                {errors.mensagem && <p className="text-red-500 text-xs mt-1">{errors.mensagem.message}</p>}
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="w-full bg-[#4f7dc3] hover:bg-[#41659c] text-white font-medium text-sm py-3 px-4 rounded-[5px] flex items-center gap-2 justify-center transition cursor-pointer"
            >
                {isPending ? (
                    <div className="h-4 w-4 animate-spin border-2 border-white border-t-transparent rounded-full" />
                ) : (
                    <>
                        <Mail size={18} />
                        Enviar mensagem
                    </>
                )}
            </button>
        </form>

    )
}
