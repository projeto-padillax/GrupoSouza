import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { getAllChamadas } from "@/lib/actions/chamada";

interface ChamadasNaHomeSectionProps {
  titulo: string;
  subtitulo: string;
  imagem: string;
  url: string;
}

export default async function CategoryCards() {
  const categories = await getAllChamadas();

  return (
    <section className="py-12">
      <div className="w-[90%] mx-auto max-w-7xl">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5  gap-6">
          {categories.map((category: ChamadasNaHomeSectionProps, index: number) => (
            <Card
              key={index}
              className="relative overflow-hidden hover:shadow-2xl transform transition duration-300 hover:scale-105 cursor-pointer aspect-[3/4] py-0" // proporção para manter altura responsiva
            >
              <div className="relative w-full h-full">
                <Image
                  src={category.imagem}
                  alt={category.titulo}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 20vw"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                <CardContent className="absolute bottom-0 z-10 p-4 text-white">
                  <p className="text-sm opacity-90">{category.titulo}</p>
                  <h3 className="text-lg font-semibold mb-1 font-sans">{category.subtitulo}</h3>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
