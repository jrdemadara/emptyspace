import { ref } from "vue";

export interface Listing {
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

interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  last_page: number;
  per_page: number;
  total: number;
}

export const useListings = () => {
  const listings = ref<Listing[]>([]);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  // pagination state
  const currentPage = ref(1);
  const lastPage = ref(1);
  const total = ref(0);
  const perPage = ref(10);

  const fetchListings = async (filters: Record<string, string | number> = {}) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await $fetch<PaginatedResponse<Listing>>("/api/listings", {
        params: {
          ...filters,
          per_page: perPage.value,
        },
      });

      listings.value = response.data;
      currentPage.value = response.current_page;
      lastPage.value = response.last_page;
      perPage.value = response.per_page;
      total.value = response.total;
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

  return {
    listings,
    loading,
    error,
    fetchListings,
    currentPage,
    lastPage,
    perPage,
    total,
  };
};
