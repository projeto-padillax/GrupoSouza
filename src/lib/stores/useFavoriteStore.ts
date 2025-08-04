// lib/stores/useFavoriteStore.ts
import { create } from "zustand";

type FavoriteStore = {
  favorites: string[];
  setFavorites: (favs: string[]) => void;
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
};

export const useFavoriteStore = create<FavoriteStore>((set, get) => ({
  favorites: [],

  setFavorites: (favs) => set({ favorites: favs }),

  addFavorite: (id) =>
    set((state) => {
      const updated = [...state.favorites, id];
      localStorage.setItem("favorites", JSON.stringify(updated));
      return { favorites: updated };
    }),

  removeFavorite: (id) =>
    set((state) => {
      const updated = state.favorites.filter((fav) => fav !== id);
      localStorage.setItem("favorites", JSON.stringify(updated));
      return { favorites: updated };
    }),

  isFavorite: (id) => get().favorites.includes(id),
}));
