import Image from "next/image";
import Header from "@/components/site/header";
import Footer from "@/components/site/footer";
import { MessageSquareMore } from "lucide-react";
import ContatoForm from "@/components/site/contatoForm";
import { GetEnderecos } from "@/lib/actions/config";
import Link from "next/link";

type Telefone = {
    numero: string | null;
    isWhats: boolean | null;
    titulo: string | null;
};

type Endereco = {
    id: number;
    rua: string | null;
    bairro: string | null;
    cidade: string | null;
    estado: string | null;
    cep: string | null;
    linkGoogleMaps: string | null;
    telefone1: string | null;
    isWhatsApp1: boolean | null;
    tituloTelefone1: string | null;
    telefone2: string | null;
    isWhatsApp2: boolean | null;
    tituloTelefone2: string | null;
    telefone3: string | null;
    isWhatsApp3: boolean | null;
    tituloTelefone3: string | null;
};

export default async function Contatos() {
    const enderecos: Endereco[] = await GetEnderecos();

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />

            <main className="flex-1">
                {/* Banner topo */}
                <section className="relative w-full h-[320px] md:h-[320px]">
                    <Image
                        src="/contato.webp"
                        alt="Atendimento ao cliente"
                        fill
                        priority
                        sizes="100vw"
                        className="object-cover"
                    />
                    <div className="absolute inset-0" />
                    <div className="absolute inset-0 z-0 flex items-end justify-center">
                        <h1 className="text-white text-md md:text-4xl font-semibold pb-10 md:pb-7">
                            Entre em contato conosco
                        </h1>
                    </div>
                </section>

                <section className="py-12 md:py-16">
                    <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        <div className="text-[#444] text-lg leading-relaxed space-y-6">
                            <h2 className="text-2xl font-semibold text-[#111]">
                                Escolha a melhor forma para falar conosco.
                            </h2>

                            <div>
                                <h3 className="text-lg font-semibold text-[#111] mb-3">Telefone(s)</h3>

                                {enderecos.length === 0 && (
                                    <p className="text-base text-[#666]">Nenhum telefone cadastrado.</p>
                                )}

                                {enderecos.map((endereco, idx) => {
                                    const sede = `Sede ${idx + 1}`;
                                    const telefones: Telefone[] = [
                                        { numero: endereco.telefone1, isWhats: endereco.isWhatsApp1, titulo: null },
                                        { numero: endereco.telefone2, isWhats: endereco.isWhatsApp2, titulo: null },
                                        { numero: endereco.telefone3, isWhats: endereco.isWhatsApp3, titulo: null },
                                    ];

                                    // pega somente os que têm número
                                    const ativos = telefones.filter((t) => t.numero);

                                    if (ativos.length === 0) return null;

                                    return (
                                        <div key={endereco.id} className="mb-2">
                                            <p className="font-semibold text-[#111]">{sede}</p>
                                            <p className="text-base">
                                                {ativos.map((t, i) => {
                                                    const numeroDigits = t.numero!.replace(/\D/g, "");
                                                    const ddd = numeroDigits.slice(0, 2);
                                                    const restante = numeroDigits.slice(2);
                                                    const numeroFormatado = `(${ddd}) ${restante}`;

                                                    const elemento = t.isWhats ? (
                                                        <Link
                                                            key={i}
                                                            href={`https://wa.me/55${numeroDigits}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-[#4f7dc3] hover:underline"
                                                        >
                                                            {numeroFormatado}
                                                        </Link>
                                                    ) : (
                                                        <span key={i}>{numeroFormatado}</span>
                                                    );

                                                    return (
                                                        <span key={i}>
                                                            {elemento}
                                                            {i < ativos.length - 1 && " | "}
                                                        </span>
                                                    );
                                                })}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Endereços */}
                            <div>
                                <h3 className="text-lg font-semibold text-[#111] mb-2">Endereço(s)</h3>

                                {enderecos.length === 0 && (
                                    <p className="text-base text-[#666]">Nenhum endereço cadastrado.</p>
                                )}

                                {enderecos.map((endereco, idx) => {
                                    const sede = `Sede ${idx + 1}`;
                                    const linha1 = [
                                        endereco.rua,
                                        endereco.bairro ? `- ${endereco.bairro}` : null,
                                    ]
                                        .filter(Boolean)
                                        .join(" ");
                                    const linha2 = [
                                        endereco.cidade,
                                        endereco.estado ? `/${endereco.estado}` : null,
                                    ]
                                        .filter(Boolean)
                                        .join("");

                                    return (
                                        <div key={endereco.id} className="mb-4">
                                            <p className="font-semibold text-[#111]">{sede}</p>
                                            {linha1 && <p>{linha1}</p>}
                                            {linha2 && <p>{linha2}</p>}
                                            {endereco.cep && <p>CEP: {endereco.cep}</p>}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Card do formulário */}
                        <div className="rounded-lg border border-gray-200 shadow-md lg:shadow-[0_0_15px_5px_rgba(0,0,0,0.2)] overflow-hidden bg-white">
                            <div className="px-6 py-4 pb-0 flex items-center gap-2 bg-white">
                                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[#111] text-sm">
                                    <MessageSquareMore size={18} />
                                </span>
                                <h2 className="text-[20px] font-semibold text-[#111]">Entre em Contato</h2>
                            </div>
                            <div className="p-4 md:p-6 bg-white">
                                <ContatoForm />
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
