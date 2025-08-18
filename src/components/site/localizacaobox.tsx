"use client";

import { useState } from "react";
import { Lock } from "lucide-react";

interface LocalizacaoBoxProps {
  bairro: string;
  cidade: string;
  lat: number | string;
  lng: number | string;
}

export default function LocalizacaoBox({ bairro, cidade, lat, lng }: LocalizacaoBoxProps) {
  const [mapaAberto, setMapaAberto] = useState(false);

  return (
    <div>
      <h2 className="text-[#4d4d4d] text-xl font-bold mb-2">Localização</h2>
      <p className="text-md text-gray-700 mb-8">
        {bairro}, {cidade}
      </p>

      <div className="relative group overflow-hidden rounded-lg shadow-md">
        <iframe
          width="100%"
          height="300"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          className={`w-full h-[300px] object-cover transition duration-300 ${
            mapaAberto ? "" : "grayscale-[40%] brightness-[0.6] pointer-events-none"
          }`}
          src={`https://www.google.com/maps?q=${lat},${lng}&z=17&output=embed`}
        />

        {!mapaAberto && (
          <>
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                className="bg-white text-black font-semibold px-4 py-2 rounded-md flex items-center gap-2 shadow-md"
                onClick={() => setMapaAberto(true)}
              >
                <Lock size={18} />
                Ver mapa
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
