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
                    <div className="flex items-center gap-3">
                        <Image
                            src="/logoGrupoSouza.png"
                            alt="Corretor"
                            width={55}
                            height={55}
                            className="rounded-full object-cover"
                        />
                        <div>
                            <p className="text-sm font-semibold text-[#111827]">Nome Corretor</p>
                            <div className="text-xs text-gray-600 space-x-4">
                                <button
                                    type="button"
                                    className="border-b border-gray-300 pb-[1px] hover:text-black hover:border-black transition"
                                    onClick={() => abrirModal('whatsapp')}
                                >
                                    Enviar WhatsApp
                                </button>
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
                    className="
                                    bg-white rounded-2xl
                                    shadow-md lg:shadow-[0_0_15px_5px_rgba(0,0,0,0.2)]
                                    p-4 sm:p-5 lg:p-6
                                    w-full max-w-none lg:max-w-[450px]
                                    mx-auto
                                "
                >
                    <div className="flex items-center justify-between gap-3">
                        <p className="text-xl sm:text-[22px] font-semibold text-gray-800 truncate">
                          {valor > 0 ?  `R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}` : "Consultar"}
                        </p>

                        {isVenda && (
                            <button
                                onClick={() => abrirModal('financiamento')}
                                className="text-[12px] border-b border-gray-300 pb-[1px] text-gray-600 hover:text-black hover:border-black transition"
                            >
                                Simular financiamento
                            </button>
                        )}
                    </div>

                    <div className="mt-3 sm:mt-4">
                        <MaisInformacoesForm codigoImovel={codigoImovel} />
                    </div>

                    <button
                        onClick={() => setAbrirAgendamento(true)}
                        className="
                                    mt-4 w-full
                                    hover:bg-gray-100 text-black font-medium
                                    text-sm py-3 px-4
                                    rounded-[6px] flex items-center gap-2 justify-center transition
                                    "
                    >
                        <CalendarClock size={18} />
                        <span> Agendar Visita</span>
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
