import Image from "next/image";
import Header from "@/components/site/header";
import Footer from "@/components/site/footer";
import AnuncieForm from "@/components/site/anuncieForm";
import { MessageSquareMore } from "lucide-react";

export default function Anuncie() {

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <section className="relative w-full h-[320px] md:h-[320px]">
          <Image
            src="/Anuncie seu imovel.jpg"
            alt="Ambiente de sala com sofá"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0" />
          <div className="absolute inset-0 z-10 flex items-end justify-center">
            <h1 className="
                    text-white 
                    text-md md:text-4xl
                    font-semibold 
                    text-center 
                    pb-10 md:pb-14 
                "
                >
              Anuncie seu imóvel para alugar ou vender
            </h1>
          </div>
        </section>

        <section className="py-8 md:py-10">
          <div className="max-w-3xl mx-auto px-4 text-lg text-center text-[#444] leading-relaxed">
            <p>
              Anuncie de graça! No Grupo Souza seu imóvel ganha visibilidade no
              maior portal de Piracicaba e nos melhores portais imobiliários do
              mercado nacional.
            </p>
          </div>
        </section>

        <section className="pb-16">
          <div className="max-w-4xl mx-auto px-4">
            <div className="rounded-2xl border border-gray-200 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] overflow-hidden">
              <div className="border-b border-gray-100 px-6 py-4 flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[#111] text-sm">
                  <MessageSquareMore size={18}/>
                </span>
                <h2 className="text-[15px] font-semibold text-[#111]">
                  Anuncie seu Imóvel
                </h2>
              </div>
              <div className="p-4 md:p-6 bg-white">
                <AnuncieForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
