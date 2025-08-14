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
    if (isFav) {
      removeFavorite(propertyId);
    } else {
      addFavorite(propertyId);
    }
  };

  return (
    <button
      className="z-50"
      onClick={(e) => {
        e.preventDefault();
        toggleFavorite();
      }}
      aria-label="Favoritar"
    >
      <Heart
        size={24}
        className={`hover:text-blue-700 transition-colors duration-200 ${
          isFav ? "text-blue-500 fill-blue-500" : "text-gray-400"
        }`}
      />
    </button>
  );
}
