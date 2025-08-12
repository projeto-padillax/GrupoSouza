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
  email: z.email('Email inválido'),
  telefone: z.string().min(8, 'Informe um telefone válido'),
  assunto: z.string().min(1, 'Informe o assunto'),
  mensagem: z.string().min(5, 'Escreva sua mensagem'),
})

type FormData = z.infer<typeof schema>

export default function ContatoForm() {
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = (data: FormData) => {
    startTransition(async () => {
      try {
        await createFormulario({
          tipo: 'CONTATO',
          nome: data.nome,
          email: data.email,
          telefone: data.telefone,
          mensagem: data.mensagem,
          urlRespondida: typeof window !== 'undefined' ? window.location.href : '',
        })

        toast.success('Mensagem enviada com sucesso!')
        reset({ nome: '', email: '', telefone: '', assunto: '', mensagem: '' })
      } catch (err) {
        console.error(err)
        toast.error('Erro ao enviar mensagem.')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 text-sm">
      <div>
        <input
          {...register('nome')}
          placeholder="Nome"
          className="w-full border border-gray-200 bg-gray-100 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#4f7dc3]"
        />
        {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome.message}</p>}
      </div>

      <div>
        <input
          {...register('email')}
          placeholder="E-mail"
          className="w-full border border-gray-200 bg-gray-100 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#4f7dc3]"
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <input
          {...register('telefone')}
          placeholder="Telefone"
          className="w-full border border-gray-200 bg-gray-100 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#4f7dc3]"
        />
        {errors.telefone && <p className="text-red-500 text-xs mt-1">{errors.telefone.message}</p>}
      </div>

      <div>
        <input
          {...register('assunto')}
          placeholder="Assunto"
          className="w-full border border-gray-200 bg-gray-100 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#4f7dc3]"
        />
        {errors.assunto && <p className="text-red-500 text-xs mt-1">{errors.assunto.message}</p>}
      </div>

      <div>
        <textarea
          {...register('mensagem')}
          placeholder="Escreva sua Mensagem"
          className="w-full border border-gray-200 bg-gray-100 rounded-lg px-4 py-3 resize-none min-h-[96px] outline-none focus:ring-2 focus:ring-[#4f7dc3]"
        />
        {errors.mensagem && <p className="text-red-500 text-xs mt-1">{errors.mensagem.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-[#0b1f3b] hover:bg-[#091730] text-white font-semibold tracking-wide text-sm py-3 rounded-lg flex items-center gap-2 justify-center transition cursor-pointer"
      >
        {isPending ? (
          <div className="h-4 w-4 animate-spin border-2 border-white border-t-transparent rounded-full" />
        ) : (
          <>
            <Mail size={18} />
            ENVIAR
          </>
        )}
      </button>
    </form>
  )
}
