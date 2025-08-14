import Image from "next/image";
import Header from "@/components/site/header";
import Footer from "@/components/site/footer";
import { getSobreNos } from "@/lib/actions/config";
// import BreadCrumb from "@/components/site/filteredBreadcrumb";

export default async function Empresa() {
  const sobre = await getSobreNos();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="shadow-lg">
        <Header />
      </div>

      <main className="flex-1">
        <section className="relative w-full py-8">
          <div className="w-[90%] mx-auto max-w-7xl">
            {/* <div className="rounded-sm mb-5">
              <BreadCrumb />
            </div> */}
            <div className="relative w-full h-[200px] md:h-[240px] rounded-lg overflow-hidden">
              <Image
                src="/sobre.webp"
                alt="grupo souza"
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
              <div className="absolute inset-y-0 left-0 flex items-center z-10 px-6">
                <h1 className="text-white text-2xl md:text-4xl font-semibold ml-10">
                  A Empresa
                </h1>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 md:py-12">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#333] mb-6">
              Ajudamos você a ter qualidade de vida morando em Piracicaba
            </h2>

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
