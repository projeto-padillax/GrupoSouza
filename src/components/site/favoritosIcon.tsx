// components/FavoriteIcon.tsx
"use client";

import { useFavoriteStore } from "@/lib/stores/useFavoriteStore";
import { Heart } from "lucide-react";

export default function FavoriteIcon() {
  const favorites = useFavoriteStore((state) => state.favorites);

  // Se não tiver nenhum favorito, não renderiza nada
  if (favorites.length === 0) return null;

  return (
    <div className="relative w-8 h-8 cursor-pointer">
        { /* hover nao ta funcionando */}
      <Heart className="text-[#303030] hover:text-[#4F7DC3] w-8 h-8 border border-transparent rounded-full transition-colors duration-200" /> 
      <div className="absolute -top-1 -right-1 bg-[#4f7dc3] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
        {favorites.length}
      </div>
    </div>
  );
}
