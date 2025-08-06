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
        size={24}
        className={`transition-colors duration-200 ${
          isFav ? "text-blue-500 fill-blue-500" : "text-gray-400"
        }`}
      />
    </button>
  );
}
