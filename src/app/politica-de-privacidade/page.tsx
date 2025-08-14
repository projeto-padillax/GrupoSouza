import Image from "next/image";
import Header from "@/components/site/header";
import Footer from "@/components/site/footer";
// import BreadCrumb from "@/components/site/filteredBreadcrumb";

export default function PoliticaDePrivacidade() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="shadow-lg">
        <Header />
      </div>

      <main className="flex-1">
        <section className="relative w-full py-8 pb-0">
          <div className="w-[90%] mx-auto max-w-7xl">
            {/* <div className="rounded-sm mb-5">
              <BreadCrumb/>
            </div> */}
            <div className="relative w-full h-[200px] md:h-[240px] rounded-lg overflow-hidden">
              <Image
                src="/contato.webp"
                alt="Política de Privacidade"
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
              <div className="absolute inset-y-0 left-0 flex items-center z-10 px-6">
                <h1 className="text-white text-2xl md:text-4xl font-semibold ml-10">
                  Política de Privacidade
                </h1>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 md:py-12">
          <div className="max-w-4xl mx-auto px-4">
            <p className="text-lg text-[#444] leading-relaxed">
              A privacidade dos visitantes do site do Grupo Souza é muito
              importante para nós. Esta página descreve quais informações
              pessoais coletamos e como as utilizamos.
            </p>

            <h3 className="mt-6 mb-1 font-semibold text-[#111]">
              Coleta de Informações
            </h3>
            <p className="text-[#444] leading-relaxed">
              Quando você visita nosso site, podemos coletar informações sobre
              seu navegador, endereço IP e páginas visitadas. Também podemos
              armazenar informações fornecidas voluntariamente, como nome,
              email, telefone e preferências de imóveis.
            </p>

            <h3 className="mt-6 mb-1 font-semibold text-[#111]">
              Uso das Informações
            </h3>
            <p className="text-[#444] leading-relaxed">
              As informações coletadas são utilizadas para entender as
              necessidades dos nossos visitantes, fornecer um serviço melhor e
              personalizado, processar pedidos, e para enviar informações
              relevantes sobre imóveis e serviços oferecidos pelo Grupo Souza.
            </p>

            <h3 className="mt-6 mb-1 font-semibold text-[#111]">
              Compartilhamento de Informações
            </h3>
            <p className="text-[#444] leading-relaxed">
              Nós não compartilhamos, vendemos ou alugamos suas informações
              pessoais para terceiros sem o seu consentimento, exceto quando
              exigido por lei ou para proteger nossos direitos legais.
            </p>

            <h3 className="mt-6 mb-1 font-semibold text-[#111]">Cookies</h3>
            <p className="text-[#444] leading-relaxed">
              Nosso site pode utilizar cookies para melhorar a experiência do
              usuário. Você pode desabilitar os cookies nas configurações do seu
              navegador, mas isso pode afetar a funcionalidade do site.
            </p>

            <h3 className="mt-6 mb-1 font-semibold text-[#111]">Segurança</h3>
            <p className="text-[#444] leading-relaxed">
              Tomamos medidas de segurança para proteger suas informações contra
              acesso não autorizado ou uso indevido.
            </p>

            <h3 className="mt-6 mb-1 font-semibold text-[#111]">Contato</h3>
            <p className="text-[#444] leading-relaxed">
              Se você tiver alguma dúvida sobre nossa política de privacidade,
              entre em contato conosco pela página de{" "}
              <a href="/contato" className="text-[#4f7dc3] hover:underline">
                Fale Conosco
              </a>
              .
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
