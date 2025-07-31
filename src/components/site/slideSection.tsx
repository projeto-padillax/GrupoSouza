"use client";
import Link from "next/link";
import { useEffect } from "react";

interface SlideSectionProps {
  imageUrl?: string;
  titulo?: string;
  url?: string;
}

export default function SlideSection(slide: SlideSectionProps) {
  useEffect(() => {
    console.log(slide);
  }, []);
  return (
    <section className="py-8">
      <div className="w-11/12 mx-auto max-w-6xl">
        <div
          className="relative h-80 bg-center bg-cover rounded-lg overflow-hidden object-cover"
          style={{ backgroundImage: `url(${slide.imageUrl})` }}
        >
          <Link href={slide.url ?? "#"} className="absolute w-full h-full z-10">
            {!slide.imageUrl && (
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            )}
          </Link>
          <div
            className="absolute [background:linear-gradient(0deg,rgba(0,0,0,0.59)_0%,rgba(237,221,83,0)_100%)] bottom-0 left-0 right-0 flex items-end px-[2.4rem]
  py-[2rem] text-white"
          >
            <h2
              dangerouslySetInnerHTML={{
                __html: slide.titulo ?? "Slide não encontrado",
              }}
              className="font-semibold text-lg text-white text-center max-w-2xl font-sans leading-[1.2]"
            ></h2>
          </div>
        </div>
      </div>
    </section>
  );
}
