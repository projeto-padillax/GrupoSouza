import Secoes from "@/components/admin/secoes";

export default async function SecoesListPage() {
    const secoes = [
        {
            id: "1",
            titulo: "Página Inicial",
            url: "https://www.template.leadlink.com.br/",
            edicao: "Não",
            sitemap: "Sim",
        },
    ];
    return <Secoes secoes={secoes} />
}
