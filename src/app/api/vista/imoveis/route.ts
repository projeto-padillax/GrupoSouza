export async function POST(request: Request) {
  try {

    const pesquisa = {
      fields: [
        "Codigo", "Categoria", "Bairro", "Cidade", "ValorVenda", "ValorLocacao",
        "Dormitorios", "Suites", "Vagas", "AreaTotal", "AreaPrivativa",
        "Caracteristicas", "InfraEstrutura", "Aberturas", "FotoDestaque",
        "FotoDestaquePequena", "Latitude", "Longitude", "Status", "Finalidade",
        "DataHoraAtualizacao"
      ],
      paginacao: {
        pagina: 1,
        quantidade: 50
      }
    };

    const params = new URLSearchParams({
      key: "5c0ad54d962643c872414a5944020381",
      pesquisa: JSON.stringify(pesquisa),
      showtotal: "1"
    });

    const url = `https://gruposou-rest.vistahost.com.br/imoveis/listar?${params}`;
    console.log(url)

    const externalResponse = await fetch(url, {
      method: 'GET',
      headers: {
        "Accept": 'application/json',
      },
    });

    console.log(externalResponse)

    if (!externalResponse.ok) {
      console.error(externalResponse.statusText)
      return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await externalResponse.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export function GET() {
  return new Response("Method Not Allowed", { status: 405 });
}
