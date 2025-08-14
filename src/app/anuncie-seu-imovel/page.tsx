import Image from "next/image";
import Header from "@/components/site/header";
import Footer from "@/components/site/footer";
import AnuncieForm from "@/components/site/anuncieForm";
import BreadCrumb from "@/components/site/filteredBreadcrumb";

export default function AnuncieImovel() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="shadow-lg">
        <Header />
      </div>

      <main className="flex-1">
        <section className="relative w-full py-8">
          <div className="w-[90%] mx-auto max-w-7xl">
            <div className="rounded-sm mb-5">
              <BreadCrumb/>
            </div>
            <div className="relative w-full h-[200px] md:h-[240px] rounded-lg overflow-hidden">
              <Image
                src="/Anuncie seu imovel.jpg"
                alt="Ambiente de sala com sofá"
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
              {/* Sombra lateral da esquerda para direita */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
              <div className="absolute inset-y-0 left-0 flex items-center z-10 px-6">
                <h1 className="text-white text-2xl ml-10 md:text-4xl ">
                  Anunciar imóvel
                </h1>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 md:py-12">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#111] mb-4">
              Deixe seu imóvel conosco
            </h2>
            <p className="text-lg text-[#444] leading-relaxed text-justify">
              Anuncie de graça! No Grupo Souza seu imóvel ganha visibilidade no
              maior portal de Piracicaba e nos melhores portais imobiliários do
              mercado nacional.
            </p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4">
          <AnuncieForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}
