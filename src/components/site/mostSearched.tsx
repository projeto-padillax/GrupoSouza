import { getAllMaisAcessados } from "@/lib/actions/links";
import Link from "next/link";
;

export async function MostSearched() {
    const links = await getAllMaisAcessados();    

  return (
    <section className="py-12">
      <div className="w-[90%] mx-auto max-w-7xl">
        <h1 className="text-4xl mb-8 font-semibold text-[#313131]">Mais buscados</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {links.map((item) => (
            <Link href={item.url} key={item.id} className="hover:text-[#4F7DC3] cursor-pointer hover:underline text-lg">{item.titulo}</Link>
          ))}
        </div>
      </div>
    </section>
  )
}
