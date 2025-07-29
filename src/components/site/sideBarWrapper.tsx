import { getAllPaginasConteudo } from "@/lib/actions/contentPages";
import Sidebar from "./sidebar"; // seu componente client

export default async function SidebarWrapper() {
  const items = await getAllPaginasConteudo();

  return <Sidebar dynamicItems={items} />;
}
