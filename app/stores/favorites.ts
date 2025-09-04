import { defineStore } from "pinia";

export interface Favorite {
  id: number;
  title: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  views: number;
  price: number;
  image: string | null;
  type: string;
}

export const useFavorite = defineStore("favorites", {
  state: () => ({
    items: [] as Favorite[],
  }),

  getters: {
    count: (state): number => state.items.length,
    hasItem: (state) => {
      return (id: number): boolean =>
        state.items.some((item) => item.id === id);
    },
  },

  actions: {
    has() {
      return this.items.length > 0;
    },

    add(item: Favorite) {
      if (!this.items.some((fav) => fav.id === item.id)) {
        this.items.push(item);
      }
    },

    remove(id: number) {
      this.items = this.items.filter((item) => item.id !== id);
    },

    load() {
      const saved = localStorage.getItem("favorites");
      if (saved) {
        try {
          this.items = JSON.parse(saved) as Favorite[];
        } catch (e) {
          console.error("Failed to parse favorites from localStorage", e);
        }
      }
    },

    toggle(item: Favorite) {
      if (this.hasItem(item.id)) {
        this.remove(item.id);
      } else {
        this.add(item);
      }
    },

    clear() {
      this.items = [];
    },
  },
  persist: true,
});
