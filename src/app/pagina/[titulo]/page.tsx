import { notFound } from "next/navigation";
import Header from "@/components/site/header";
import Footer from "@/components/site/footer";
import { getPaginaByTitle } from "@/lib/actions/contentPages";
import "@/app/html-padrao.css";
import BreadCrumb from "@/components/site/filteredBreadcrumb";

interface DynamicPageProps {
  params: Promise<{ titulo: string }>;
}

export default async function DynamicPage({ params }: DynamicPageProps) {
  const tituloOriginal = await params.then((p) => (p.titulo));
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
              <BreadCrumb pageTitle={tituloOriginal} />
            </div>
          </div>
        </div>

        {pageData.imagem ? (
          <section
            className="relative w-[90%] mx-auto max-w-7xl h-[250px] bg-cover bg-center object-cover rounded-4xl justify-items-center"
            style={{ backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.938813025210084) 0%, rgba(0,0,0,0) 60%),url(${pageData.imagem})` }}
          >
            <div className="relative z-10 w-[90%] h-full flex flex-col justify-center max-w-7xl">
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
          className={`max-w-5xl w-[70%] mx-auto mt-10 px-4 ${pageData.imagem ? "mb-16" : "mb-1"
            }`}
        >
          <div className="html-padrao w-full max-w-6xl">
            <article dangerouslySetInnerHTML={{ __html: pageData.conteudo ?? "" }} />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
