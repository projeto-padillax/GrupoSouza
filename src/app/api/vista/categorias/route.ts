import { db } from "@/lib/firebase/clientApp";
import { doc, getDoc, setDoc } from "firebase/firestore";

export async function POST() {
  try {
    const basePesquisa = {
      fields: ["Categoria"],
    };

    const baseParams = {
      key: process.env.VISTA_KEY!,
    };

    const makeUrl = (finalidade: string) => {
      const pesquisa = {
        ...basePesquisa,
        filter: { Finalidade: finalidade },
      };

      const params = new URLSearchParams({
        ...baseParams,
        pesquisa: JSON.stringify(pesquisa),
      });

      return `https://gruposou-rest.vistahost.com.br/imoveis/listarConteudo?${params}`;
    };

    // Requisições paralelas
    const [residencialResponse, comercialResponse] = await Promise.all([
      fetch(makeUrl("RESIDENCIAL"), {
        method: "GET",
        headers: { Accept: "application/json" },
      }),
      fetch(makeUrl("COMERCIAL"), {
        method: "GET",
        headers: { Accept: "application/json" },
      }),
    ]);

    if (!residencialResponse.ok || !comercialResponse.ok) {
      throw new Error("Falha ao obter categorias");
    }

    const residencialData = await residencialResponse.json();
    const comercialData = await comercialResponse.json();

    // Trata as categorias (divide se vierem juntas com vírgula, remove vazios, remove duplicatas)
    const parseCategorias = (entrada: string[] = []) =>
      [...new Set(
        entrada
          .flatMap((cat) =>
            cat
              .split(",")
              .map((c) => c.trim())
              .filter((c) => c !== "")
          )
      )];

    const categoriasResidencial = parseCategorias(residencialData?.Categoria);
    const categoriasComercial = parseCategorias(comercialData?.Categoria);

    // Salva no Firestore
    await setDoc(doc(db, "categorias", "tipos"), {
      residencial: categoriasResidencial,
      comercial: categoriasComercial,
    });

    return new Response(
      JSON.stringify({
        message: "Categorias armazenadas com sucesso",
        totalResidencial: categoriasResidencial.length,
        totalComercial: categoriasComercial.length,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Erro no POST:", error);
    return new Response(
      JSON.stringify({ error: "Erro interno no servidor" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function GET() {
  try {
    const docRef = doc(db, "categorias", "tipos");
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return new Response(
        JSON.stringify({ error: "Categorias não encontradas" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = docSnap.data();

    return new Response(
      JSON.stringify({
        residencial: data.residencial ?? [],
        comercial: data.comercial ?? [],
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    return new Response(
      JSON.stringify({ error: "Erro interno no servidor" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}