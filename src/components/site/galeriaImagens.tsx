'use client';

import Image from "next/image";
import { Camera, Video } from "lucide-react";
import { useState } from "react";
import GaleriaModal from "./galeriaModal";

interface GaleriaImagensProps {
  imagens: { Foto: string }[];
  principal: string;
  video: { url: string }[];
}

export default function GaleriaImagens({ imagens, principal, video }: GaleriaImagensProps) {
  const [modalAberta, setModalAberta] = useState(false);
  const temVideo = Array.isArray(video) && video.length > 0;

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 h-[448px]">
        <div
          className="w-full md:w-4/7 h-full flex-shrink-0 relative rounded-md overflow-hidden cursor-pointer"
          onClick={() => setModalAberta(true)}
        >
          <Image
            src={principal}
            alt="Foto principal"
            fill
            className="object-cover rounded-md"
            sizes="(max-width: 768px) 100vw, 60vw"
            priority
          />
          {(temVideo || imagens.length > 4) && (
            <div className="absolute bottom-6 left-6 flex gap-2">
              {temVideo && (
                <div className="bg-white/80 text-sm text-gray-800 px-2 py-1 rounded-md flex items-center gap-1 shadow">
                  <Video size={16} className="text-gray-600" />
                  <span>Vídeo</span>
                </div>
              )}

              {imagens.length > 4 && (
                <div className="bg-white/80 text-sm text-gray-800 px-2 py-1 rounded-md flex items-center gap-1 shadow">
                  <Camera size={16} className="text-gray-600" />
                  <span>+ {imagens.length - 4} Fotos</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 grid-rows-2 gap-[6px] w-full md:w-1/2 h-full">
          {imagens.slice(0, 4).map((foto, i) => (
            <div
              key={i}
              className="relative w-full h-full rounded-md overflow-hidden cursor-pointer"
              onClick={() => setModalAberta(true)}
            >
              <Image
                src={foto.Foto}
                alt={`Foto ${i + 1}`}
                fill
                className="object-cover rounded-md"
                sizes="(max-width: 768px) 50vw, 30vw"
              />
            </div>
          ))}
        </div>
      </div>

      {modalAberta && (
        <GaleriaModal imagens={imagens} onClose={() => setModalAberta(false)} />
      )}
    </>
  );
}
