// composables/useListings.ts
import { ref } from "vue";

export interface Listing {
  title: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  views: number;
  price: number;
  images: { path: string }[];
  type: string;
}

export const useListings = () => {
  const listings = ref<Listing[]>([]);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  const fetchListings = async () => {
    loading.value = true;
    error.value = null;
    try {
      const data = await $fetch<Listing[]>("/api/listings");
      listings.value = data;
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err;
      } else {
        error.value = new Error("Unknown error");
      }
    } finally {
      loading.value = false;
    }
  };

  return { listings, loading, error, fetchListings };
};
