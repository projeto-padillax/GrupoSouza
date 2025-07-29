import { notFound } from "next/navigation";
import Header from "@/components/site/header";
import Footer from "@/components/site/footer";
import { getPaginaByTitle } from "@/lib/actions/contentPages";

interface DynamicPageProps {
  params: Promise<{ titulo: string }>;
}

export default async function DynamicPage({ params }: DynamicPageProps) {
  const { titulo } = await params;
  const pageData = await getPaginaByTitle(titulo);

  if (!pageData) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col pb-8">
      <Header />

      <main className="flex-1 bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          {/* <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li>
                <a href="/" className="hover:text-blue-600">Início</a>
              </li>
              <li>/</li>
              <li className="text-gray-900 font-medium">{pageData.title}</li>
            </ol>
          </nav> */}
          <section
            className="bg-cover bg-center w-full"
            style={{ backgroundImage: `url(${pageData.imagem})` }}
          >
            <div className="w-11/12 max-w-7xl">
              <h1>{pageData.titulo}</h1>
            </div>
          </section>
          {/* Conteúdo da Página */}
          <article className="bg-white rounded-lg shadow-sm p-8">
            <div className="text-sm text-gray-500">
              {pageData.conteudo && <p className="mb-4">{pageData.conteudo}</p>}
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
