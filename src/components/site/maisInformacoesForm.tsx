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
    celular: z.string().min(8, 'Informe um telefone válido'),
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
        defaultValues: { mensagem: defaultMsg },
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
                    urlRespondida: typeof window !== 'undefined' ? window.location.href : '',
                })
                toast.success('Mensagem enviada com sucesso!')
                reset({ nome: '', celular: '', email: '', mensagem: defaultMsg })
            } catch (e) {
                console.error(e)
                toast.error('Erro ao enviar mensagem.')
            }
        })
    }

    const baseInput =
        'w-full bg-transparent outline-none border-0 focus:ring-0 placeholder:text-[#9aa2b1] text-[15px] text-gray-900'
    const cell = 'p-4 sm:p-2'
    const label = 'block text-[11px] font-semibold tracking-wide text-gray-800 uppercase mb-1'

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="text-sm">
            <div className="rounded-md border border-gray-600 overflow-hidden">
                <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-600">
                    <div className={cell}>
                        <label className={label}>Nome</label>
                        <input {...register('nome')} className={baseInput} />
                        {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome.message}</p>}
                    </div>

                    <div className={cell}>
                        <label className={label}>Celular</label>
                        <input
                            {...register('celular')}
                            className={baseInput}
                        />
                        {errors.celular && <p className="text-red-500 text-xs mt-1">{errors.celular.message}</p>}
                    </div>
                </div>

                <div className="border-t border-gray-600">
                    <div className={cell}>
                        <label className={label}>E-mail</label>
                        <input {...register('email')} className={baseInput} />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                </div>

                <div className="border-t border-gray-600">
                    <div className={cell}>
                        <textarea
                            {...register('mensagem')}
                            className={`${baseInput} resize-none min-h-[50px]`}
                        />
                        {errors.mensagem && (
                            <p className="text-red-500 text-xs mt-1">{errors.mensagem.message}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Botão */}
            <button
                type="submit"
                disabled={isPending}
                className="mt-3 w-full bg-[#4f7dc3] hover:bg-[#426db0] text-white font-medium text-sm py-3 px-4 rounded-xl flex items-center gap-2 justify-center transition"
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
