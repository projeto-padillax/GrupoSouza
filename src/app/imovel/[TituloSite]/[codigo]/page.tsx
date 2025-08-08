import Footer from "@/components/site/footer";
import Header from "@/components/site/header";
import ImovelContatoBox from "@/components/site/imovelContatoBox";
import { BedDouble, CarFront, Dot, Home, Ratio } from "lucide-react";
import GaleriaImagens from "@/components/site/galeriaImagens";
import { notFound } from "next/navigation";
import AgendamentoForm from "@/components/site/agendamentoForm";
import EmpreendimentoBox from "@/components/site/empreendimentoBox";
import MidiaBox from "@/components/site/midiaBox";
import SemelhantesSection from "@/components/site/semelhantesSection";

export default async function ImovelPage({
    params,
}: {
    params: { codigo: string; tituloSite: string };
}) {
    const res = await fetch(`http://localhost:3000/api/vista/imoveis/${params.codigo}`, {
        cache: "no-store",
    });

    if (!res.ok) {
        return notFound();
    }

    const imovel = await res.json();
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <section className="pt-4 border-t border-gray-200 mb-4">
                        <div className="flex justify-between items-center">
                            <nav className="text-sm text-gray-500">
                                BreadCrumb
                            </nav>
                        </div>
                    </section>

                    <section className="mb-8">
                        <GaleriaImagens
                            imagens={[
                                { Foto: imovel.FotoDestaque },
                                { Foto: imovel.FotoDestaque },
                                { Foto: imovel.FotoDestaque },
                                { Foto: imovel.FotoDestaque },
                                { Foto: imovel.FotoDestaque },
                                { Foto: imovel.FotoDestaque },
                                { Foto: imovel.FotoDestaque },
                                { Foto: imovel.FotoDestaque },
                            ]}
                            principal={imovel.FotoDestaque}
                            video={imovel.VideoDestaque && imovel.VideoDestaque.trim() !== ""
                                ? [imovel.VideoDestaque]
                                : []
                            }
                        />
                    </section>

                    <section className="mb-8">
                        <div className="grid grid-cols-1 lg:grid-cols-[3fr_1.25fr] gap-6 lg:gap-8">
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <h1 className="text-3xl font-semibold text-[#111] leading-snug break-words">
                                        {imovel.TituloSite || imovel.Descricao} 
                                    </h1>

                                    <div className="flex flex-wrap items-center gap-4 text-sm text-[#4d4d4d]">
                                        <div className="flex gap-2 flex-wrap">
                                            {[
                                                imovel.Lancamento === "Sim" && "LANÇAMENTO",
                                                imovel.Estudadação === "Sim" && "ESTUDA DAÇÃO",
                                                imovel.Etiqueta === "Sim" && "ETIQUETA",
                                            ]
                                                .filter(Boolean)
                                                .slice(0, 3)
                                                .map((badge, i) => (
                                                    <span
                                                        key={i}
                                                        className="border border-[#0061bc] bg-[#eaf4fe] text-black px-5 py-[6px] rounded-md text-xs font-medium"
                                                    >
                                                        {badge}
                                                    </span>
                                                ))}
                                        </div>

                                        {(parseFloat(imovel.ValorCondominio) > 0 || parseFloat(imovel.ValorIptu) > 0) && (
                                            <div className="flex items-center gap-2 text-xs text-black whitespace-nowrap">
                                                <span>
                                                    Condomínio R$ {parseFloat(imovel.ValorCondominio).toLocaleString("pt-BR")}/mês
                                                </span>

                                                <Dot
                                                    size={30}
                                                    className="text-gray-500 relative top-[1px]"
                                                />

                                                <span>
                                                    IPTU R$ {parseFloat(imovel.ValorIptu).toLocaleString("pt-BR")}/mês
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div
                                        className="
                                                        flex flex-wrap justify-center lg:justify-start
                                                        items-center gap-x-4 gap-y-4
                                                        text-sm text-grey mt-10
                                                    "
                                    >
                                        {imovel.Categoria && (
                                            <div className="flex flex-col items-center min-w-[90px]">
                                                <Home size={26} className="opacity-70 sm:size-[30px]" />
                                                <div className="mt-1 sm:mt-2 flex items-center gap-2">
                                                    <span className="text-center">
                                                        {imovel.Categoria
                                                            ?.toLowerCase()
                                                            .replace(/\b\w/g, (char: string) => char.toUpperCase())}
                                                    </span>
                                                    <Dot
                                                        size={25}
                                                        className="text-[#0061bc] hidden sm:inline-flex"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {imovel.Dormitorios > 0 && (
                                            <div className="flex flex-col items-center min-w-[90px]">
                                                <BedDouble size={26} className="opacity-70 sm:size-[30px]" />
                                                <div className="mt-1 sm:mt-2 flex items-center gap-2">
                                                    <span className="text-center">
                                                        {imovel.Dormitorios} quartos
                                                        {imovel.Suites > 0
                                                            ? ` (${imovel.Suites} suíte${imovel.Suites > 1 ? 's' : ''})`
                                                            : ''}
                                                    </span>
                                                    <Dot
                                                        size={25}
                                                        className="text-[#0061bc] hidden sm:inline-flex"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {imovel.AreaPrivativa > 0 && (
                                            <div className="flex flex-col items-center min-w-[90px]">
                                                <Ratio size={26} className="opacity-70 sm:size-[30px]" />
                                                <div className="mt-1 sm:mt-2 flex items-center gap-2">
                                                    <span className="text-center">
                                                        {imovel.AreaPrivativa} m² privativos
                                                    </span>
                                                    <Dot
                                                        size={25}
                                                        className="text-[#0061bc] hidden sm:inline-flex"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {imovel.AreaTerreno > 0 && (
                                            <div className="flex flex-col items-center min-w-[90px]">
                                                <Ratio size={26} className="opacity-70 sm:size-[30px]" />
                                                <div className="mt-1 sm:mt-2 flex items-center gap-2">
                                                    <span className="text-center">{imovel.AreaTerreno} m² totais</span>
                                                    <Dot
                                                        size={25}
                                                        className="text-[#0061bc] hidden sm:inline-flex"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {imovel.Vagas > 0 && (
                                            <div className="flex flex-col items-center min-w-[90px]">
                                                <CarFront size={26} className="opacity-70 sm:size-[30px]" />
                                                <div className="mt-1 sm:mt-2 flex items-center">
                                                    <span className="text-center">
                                                        {imovel.Vagas} vaga{imovel.Vagas > 1 ? 's' : ''}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>


                                </div>

                                <div className="mt-6 border-t border-gray-400"></div>

                                <div>
                                    <p className="text-gray-800 text-lg mb-8">{imovel.Descricao}</p>
                                </div>

                                <EmpreendimentoBox
                                    empreendimento={imovel.Empreendimento}
                                    imagem={imovel.FotoDestaque}
                                    caracteristicas={imovel.Caracteristicas}
                                    infraestrutura={imovel.InfraEstrutura}
                                />

                                <AgendamentoForm codigo={imovel.Codigo} />

                                <MidiaBox
                                    imagens={[
                                        { Foto: imovel.FotoDestaque },
                                        { Foto: imovel.FotoDestaque },
                                        { Foto: imovel.FotoDestaque },
                                        { Foto: imovel.FotoDestaque },
                                        { Foto: imovel.FotoDestaque },
                                        { Foto: imovel.FotoDestaque },
                                        { Foto: imovel.FotoDestaque },
                                        { Foto: imovel.FotoDestaque },
                                    ]}
                                    videos={imovel.VideoDestaque && imovel.VideoDestaque.trim() !== ""
                                        ? [imovel.VideoDestaque]
                                        : []
                                    }
                                />

                                <div>
                                    <h2 className="text-[#4d4d4d] text-xl font-bold mb-2">Localização</h2>
                                    <p className="text-md text-gray-700 mb-8">
                                        {imovel.Bairro}, {imovel.Cidade}
                                    </p>
                                    <iframe
                                        width="100%"
                                        height="300"
                                        style={{ border: 0 }}
                                        loading="lazy"
                                        allowFullScreen
                                        className="rounded-lg"
                                        src={`https://www.google.com/maps?q=${imovel.GMapsLatitude},${imovel.GMapsLongitude}&z=17&output=embed`}
                                    />
                                </div>

                            </div>

                            <ImovelContatoBox
                                financiamento={imovel.Status === 'VENDA' || imovel.Status === 'VENDA E ALUGUEL'}
                                codigoImovel={imovel.Codigo}
                                valor={parseFloat(imovel.ValorVenda || imovel.ValorLocacao)}
                                finalidade={imovel.Status as 'VENDA' | 'ALUGUEL' | 'VENDA E ALUGUEL'}
                            />

                        </div>

                        <div>
                            <SemelhantesSection codigo={imovel.Codigo} />
                        </div>

                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}
