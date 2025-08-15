'use client'

import Image from 'next/image'
import MaisInformacoesForm from './maisInformacoesForm'
import FormularioModal from './formularioModal'
import { useState } from 'react'
import { CalendarClock } from 'lucide-react'
import AgendamentoModal from './agendamentoModal'

interface ImovelContatoBoxProps {
    financiamento?: boolean
    codigoImovel: string
    valor: number
    finalidade: 'VENDA' | 'ALUGUEL' | 'VENDA E ALUGUEL'
}

export default function ImovelContatoBox({
    codigoImovel,
    valor,
    finalidade,
}: ImovelContatoBoxProps) {
    const isVenda = finalidade === 'VENDA' || finalidade === 'VENDA E ALUGUEL'

    const [abrirAgendamento, setAbrirAgendamento] = useState(false)
    const [modalAberta, setModalAberta] = useState(false)
    const [tipoModal, setTipoModal] = useState<'whatsapp' | 'financiamento' | null>(null)

    const abrirModal = (tipo: 'whatsapp' | 'financiamento') => {
        setTipoModal(tipo)
        setModalAberta(true)
    }

    return (
        <div className="block">
            <div className="lg:sticky lg:top-2">
                <div className="flex justify-center mb-3 lg:mb-4">
                    <div className="flex items-start gap-4">
                        <div className="w-[70px] h-[70px] rounded-md overflow-hidden">
                            <Image
                                src="/perfil.jpg"
                                alt="Corretor"
                                width={70}
                                height={70}
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-[#111827] tracking-wide uppercase mb-2">
                                Nome Corretor
                            </p>

                            <div className="text-[12px] text-black flex items-center gap-5">
                                <button
                                    type="button"
                                    className="border-b border-gray-300 pb-[1px] hover:text-black hover:border-black transition"
                                    onClick={() => abrirModal('whatsapp')}
                                >
                                    Enviar WhatsApp
                                </button>

                                <span className="inline-block h-4 w-px bg-white" />

                                <button
                                    type="button"
                                    className="border-b border-gray-300 pb-[1px] hover:text-black hover:border-black transition"
                                >
                                    Ligar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className="bg-white rounded-2xl shadow-md lg:shadow-[0_0_15px_5px_rgba(0,0,0,0.12)] p-4 sm:p-5 lg:p-8 w-full lg:max-w-[460px] mx-auto"
                >
                    <div className="flex items-center justify-between gap-3 mb-1">
                        <p className="text-[20px] sm:text-[20px] font-semibold text-gray-800 truncate">
                            {valor > 0 ? `R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}` : 'Consultar'}
                            
                        </p>

                        {isVenda && (
                            <button
                                onClick={() => abrirModal('financiamento')}
                                className="text-[12px] border-b border-grey-300 pb-[1px] text-black hover:text-black hover:border-black transition"
                            >
                                Simular financiamento
                            </button>
                        )}
                    </div>

                    <div className="mt-2 sm:mt-2">
                        <MaisInformacoesForm codigoImovel={codigoImovel} />
                    </div>

                    <button
                        onClick={() => setAbrirAgendamento(true)}
                        className="mt-4 w-full hover:bg-gray-100 text-black font-medium text-sm py-3 px-4 rounded-[8px] flex items-center gap-2 justify-center transition"
                    >
                        <CalendarClock size={18} />
                        <span>Agendar visita</span>
                    </button>
                </div>
            </div>

            {modalAberta && tipoModal && (
                <FormularioModal
                    open={modalAberta}
                    onClose={() => setModalAberta(false)}
                    tipo={tipoModal}
                    valorImovel={valor}
                    codigoImovel={codigoImovel}
                />
            )}

            <AgendamentoModal
                open={abrirAgendamento}
                onClose={() => setAbrirAgendamento(false)}
                codigoImovel={codigoImovel}
            />
        </div>
    )
}
