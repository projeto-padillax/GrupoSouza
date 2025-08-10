import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/clientApp";

const basePesquisaFields: string[] = [
  "Codigo", "ValorIptu", "ValorCondominio", "Categoria", "InformacaoVenda", "ObsVenda",
  "AreaTerreno", "Bairro", "GMapsLatitude", "GMapsLongitude", "DescricaoWeb", "Cidade",
  "ValorVenda", "ValorLocacao", "Dormitorios", "Suites", "Vagas", "AreaTotal", "AreaPrivativa",
  "Caracteristicas", "InfraEstrutura", "Descricao", "DataHoraAtualizacao", "Lancamento", "Codigo",
  "Descricao", "DescricaoWeb", "Finalidade", "Status", "Empreendimento", "Endereco",
  "Numero", "Complemento", "UF", "CEP", "DestaqueWeb", "FotoDestaque", "Latitude", "Longitude",
  "TituloSite", "Empreendimento", "FotoDestaqueEmpreendimento", "VideoDestaque", "Mobiliado"
]

export async function cadastraDetalhes(codigo: string) {
  const fields = [
    ...basePesquisaFields,
    { Foto: ["Foto", "FotoPequena", "Destaque"] }
  ];

  const basePesquisa = {
    fields,
  };

  const baseParams = {
    key: process.env.VISTA_KEY!
  };

  const makeUrl = () => {
    const params = new URLSearchParams({
      ...baseParams,
      pesquisa: JSON.stringify(basePesquisa),
    imovel: codigo

    });
    return `https://gruposou-rest.vistahost.com.br/imoveis/detalhes?${params}`;
  };

  try {
    const response = await fetch(makeUrl(), {
      method: "GET",
      headers: { Accept: "application/json" }
    });

    if (!response.ok) {
      return { success: false, message: "Falha ao obter detalhes do imóvel" };
    }

    const data = await response.json();
    const foto = data.Foto;

    await updateDoc(doc(db, "imoveis", codigo), { Foto: foto });

    return { success: true, message: "Fotos atualizadas com sucesso" };
  } catch (error) {
    return { success: false, message: `Erro ao atualizar fotos: ${error}` };
  }
}