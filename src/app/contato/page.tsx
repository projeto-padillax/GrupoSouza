import Image from "next/image";
import Header from "@/components/site/header";
import Footer from "@/components/site/footer";
import ContatoForm from "@/components/site/contatoForm";

export default async function Contatos() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />

            <main className="flex-1">
                <section className="relative w-full py-8">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="relative w-full h-[200px] md:h-[240px] rounded-lg overflow-hidden">
                            <Image
                                src="/contato.webp"
                                alt="Atendimento ao cliente"
                                fill
                                priority
                                sizes="100vw"
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/30" />
                            <div className="absolute inset-y-0 left-0 flex items-center z-10 px-6">
                                <h1 className="text-white text-2xl md:text-4xl font-semibold">
                                    Contato
                                </h1>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-8 md:py-12">
                    <div className="max-w-4xl mx-auto px-4">
                        <h2 className="text-2xl md:text-3xl font-semibold text-[#111] mb-4">
                            Escolha a melhor forma de falar conosco
                        </h2>
                        <p className="text-lg text-[#444] leading-relaxed">
                            O Lorem Ipsum é um texto modelo da indústria tipográfica e de
                            impressão. O Lorem Ipsum tem sido o texto padrão usado por essas
                            indústrias desde o ano de 1500, quando uma impressora desconhecida
                            pegou uma galé de tipos e os embaralhou para fazer um livro de
                            amostras de tipos.
                        </p>
                    </div>
                </section>

                <div className="max-w-4xl mx-auto px-4">
                    <ContatoForm />
                </div>

            </main>

            <Footer />
        </div>
    );
}
