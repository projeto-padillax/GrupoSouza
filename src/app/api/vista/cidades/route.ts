import { db } from "@/lib/firebase/clientApp";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";

export async function POST() {
  try {
    const basePesquisa = {
      fields: ["Cidade"],
    };

    const baseParams = {
      key: process.env.VISTA_KEY!,
    };

    const makeUrl = () => {
      const params = new URLSearchParams({
        ...baseParams,
        pesquisa: JSON.stringify(basePesquisa),
      });
      return `https://gruposou-rest.vistahost.com.br/imoveis/listarConteudo?${params}`;
    };

    const firstResponse = await fetch(makeUrl(), {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!firstResponse.ok) throw new Error("Falha ao obter cidades");

    const firstData = await firstResponse.json();

    const cidades: string[] = firstData?.Cidade ?? [];

    if (!Array.isArray(cidades) || cidades.length === 0) {
      throw new Error("Nenhuma cidade encontrada");
    }

    for (const cidade of cidades) {
      if (cidade.length == 0) continue;

      console.log(cidade);
      const pesquisa = {
        fields: ["Cidade", "Bairro"],
        filter: { Cidade: cidade },
      };

      const params = new URLSearchParams({
        ...baseParams,
        pesquisa: JSON.stringify(pesquisa),
      });

      const url = `https://gruposou-rest.vistahost.com.br/imoveis/listarConteudo?${params}`;

      const response = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        console.warn(`Falha ao buscar bairros da cidade: ${cidade}`);
        continue;
      }

      const data = await response.json();

      const bairros: string[] = (data?.Bairro ?? []).flatMap((b: string) =>
        b
          .split(",")
          .map((nome) => nome.trim())
          .filter((nome) => nome !== "")
      );

      const cidadeId = cidade.replace(/[.#$\[\]/]/g, "_");

      await setDoc(doc(db, "cidades", cidadeId), {
        bairros: [...new Set(bairros)],
      });
    }

    return new Response(
      JSON.stringify({
        message: "Cidades e bairros armazenados com sucesso",
        totalCidades: cidades.length,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Erro no POST:", error);
    return new Response(JSON.stringify({ error: "Erro interno no servidor" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function GET() {
  try {
    const snapshot = await getDocs(collection(db, "cidades"));

    const cidadesMap = new Map<string, string[]>();

    snapshot.docs.forEach((doc) => {
      const cidadeId = doc.id.toLowerCase();
      const bairros = doc.data().bairros ?? [];

      if (!cidadesMap.has(cidadeId)) {
        cidadesMap.set(cidadeId, bairros);
      }
    });

    const cidadesComBairros = Array.from(cidadesMap.entries()).map(
      ([cidadeId, bairros]) => ({
        cidade: cidadeId,
        bairros,
      })
    );

    return new Response(JSON.stringify({ cidades: cidadesComBairros }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erro ao buscar cidades:", error);
    return new Response(JSON.stringify({ error: "Erro ao buscar cidades" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
