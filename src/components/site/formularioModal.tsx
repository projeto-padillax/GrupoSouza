"use client";

import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { toast } from "sonner";
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
      nome: z.string().min(1, "Informe seu nome"),
      email: z.email("Email inválido"),
      celular: z.string().min(1, "Informe seu telefone"),
      mensagem: z.string().optional(),
      valorEntrada: z.number("Digite um valor válido").optional(),
    })
    .refine(
      (data) =>
        tipo !== "financiamento" || typeof data.valorEntrada === "number",
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
          urlRespondida: typeof window !== "undefined" ? window.location.href : "",
          codigoImovel,
          mensagem: mensagemFinal,
        });

        toast.success("Mensagem enviada com sucesso!");
        reset();
        onClose();
      } catch {
        toast.error("Erro ao enviar mensagem.");
      }
    });
  };

  if (!open) return null;

  // Estilos consistentes
  const baseInput =
        'w-full bg-transparent outline-none border-0 focus:ring-0 placeholder:text-[#9aa2b1] text-[15px] text-gray-900'
    const cell = 'p-4 sm:p-2'
    const label = 'block text-[11px] font-semibold tracking-wide text-gray-800 uppercase mb-1'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-sm">

          <div className="rounded-md border border-gray-400 overflow-hidden">
                <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-400">
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

                <div className="border-t border-gray-400">
                    <div className={cell}>
                        <label className={label}>E-mail</label>
                        <input {...register('email')} className={baseInput} />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                </div>

                  {tipo === "financiamento" && (
            <>
                  <div className="border-t border-gray-400">
                    <div className={cell}>
                         <label className={label}>Mensagem</label>
                        <textarea
                            {...register('mensagem')}
                            className={`${baseInput} resize-none min-h-[50px]`}
                        />
                        {errors.mensagem && (
                            <p className="text-red-500 text-xs mt-1">{errors.mensagem.message}</p>
                        )}
                    </div>
                </div>

          

              {/* Valor de entrada */}
               <div className="border-t border-gray-400">
                    <div className={cell}>
                        <label className={label}>Valor de Entrada</label>
                        <input inputMode="numeric" {...register('valorEntrada', { setValueAs: (v) => (v === "" ? undefined : Number(v)) })} className={baseInput} />
                        {errors.valorEntrada && <p className="text-red-500 text-xs mt-1">{errors.valorEntrada.message}</p>}
                    </div>
                </div>

            </>
          )}

            
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
              "Enviar mensagem"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}