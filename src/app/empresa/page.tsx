import Image from "next/image";
import Header from "@/components/site/header";
import Footer from "@/components/site/footer";
import { getSobreNos } from "@/lib/actions/config"; // ajuste o path

export default async function Empresa() {
    const sobre = await getSobreNos();

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />

            <main className="flex-1">
                {/* Seção da imagem */}
                <section className="relative w-full h-[320px] md:h-[320px]">
                    <Image
                        src="/sobre.webp"
                        alt="grupo souza"
                        fill
                        priority
                        sizes="100vw"
                        className="object-cover"
                    />
                    <div className="absolute inset-0" />
                    <div className="absolute inset-0 z-10 flex items-end">
                        <div className="max-w-7xl mx-auto w-full px-4">
                            <h1
                                className="text-white text-2xl md:text-4xl font-semibold pb-10 md:pb-14"
                            >
                                Sobre a Empresa
                            </h1>
                        </div>
                    </div>
                </section>

                <section className="py-8 md:py-12">
                    <div className="max-w-7xl mx-auto px-4">
                        <h2 className="text-2xl md:text-3xl font-semibold text-[#333] mb-6">
                            Ajudamos você a ter qualidade de vida morando em Piracicaba
                        </h2>

                        {/* Parágrafo sobre nós */}
                        <p className="text-lg text-[#444] leading-relaxed whitespace-pre-line">
                            {sobre && sobre.trim().length > 0
                                ? sobre
                                : "Conteúdo indisponível no momento."}
                        </p>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
