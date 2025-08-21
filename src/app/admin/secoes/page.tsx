import Secoes from "@/components/admin/secoes";
import { secoes } from "@/lib/utils";

export default async function SecoesListPage() {
    return <Secoes secoes={secoes} />
}
