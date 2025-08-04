// components/FavoriteButton.tsx
"use client";

import { useFavoriteStore } from "@/lib/stores/useFavoriteStore";
import { Heart } from "lucide-react";

type Props = {
  propertyId: string;
};

export default function FavoriteButton({ propertyId }: Props) {
  const { addFavorite, removeFavorite, isFavorite } = useFavoriteStore();

  const isFav = isFavorite(propertyId);

  const toggleFavorite = () => {
    isFav ? removeFavorite(propertyId) : addFavorite(propertyId);
  };

  return (
    <button onClick={toggleFavorite} aria-label="Favoritar">
      <Heart
        size={16}
        className={`transition-colors duration-200 ${
          isFav ? "text-red-500 fill-red-500" : "text-gray-400"
        }`}
      />
    </button>
  );
}
