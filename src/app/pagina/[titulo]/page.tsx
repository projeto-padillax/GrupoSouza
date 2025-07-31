import { notFound } from "next/navigation";
import Header from "@/components/site/header";
import Footer from "@/components/site/footer";
import { getPaginaByTitle } from "@/lib/actions/contentPages";
import "@/app/html-padrao.css";

interface DynamicPageProps {
  params: { titulo: string };
}

export default async function DynamicPage({ params }: DynamicPageProps) {
  const tituloOriginal = decodeURIComponent(params.titulo);
  const pageData = await getPaginaByTitle(tituloOriginal);

  if (!pageData) {
    notFound();
  }


  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 bg-white">
        <div className="w-full py-4">
          <div className="max-w-7xl mx-auto px-4">
            <div className="h-6 bg-gray-100 rounded-sm select-none">
              Espaço reservado para Breadcrumb
            </div>
          </div>
        </div>

        {pageData.imagem ? (
          <section
            className="relative w-full h-[250px] bg-cover bg-center flex items-end"
            style={{ backgroundImage: `url(${pageData.imagem})` }}
          >
            <div className="w-full bg-gradient-to-t from-black/50 to-transparent absolute inset-0"></div>
            <div className="relative z-10 max-w-5xl w-7xl px-4 pb-6 mx-auto">
              <h1 className="text-white text-4xl font-semibold">{pageData.titulo}</h1>
            </div>
          </section>
        ) : (
          <section className="bg-white py-10">
            <div className="max-w-5xl mx-auto px-4">
              <h1 className="text-4xl font-semibold text-gray-900">{pageData.titulo}</h1>
            </div>
          </section>
        )}

        <section
          className={`max-w-5xl mx-auto mt-10 px-4 ${pageData.imagem ? "mb-16" : "mb-1"
            }`}
        >
          <div className="html-padrao">
            <article dangerouslySetInnerHTML={{ __html: pageData.conteudo ?? "" }} />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
