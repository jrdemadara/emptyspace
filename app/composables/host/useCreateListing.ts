interface CreateListingResponse {
  message: string;
}

interface NearbyPlace {
  place_name: string;
  place_type: string;
  distance: number;
  duration: number;
  mode: string;
}

export interface Listing {
  title: string;
  description: string;
  availability: string;
  address: string;
  barangay: string;
  city: string;
  country: string;
  longitude: number;
  latitude: number;
  landmark: string;
  price: number;

  occupants: number;
  bedrooms: number;
  bathrooms: number;
  month_advance: number;
  month_deposit: number;

  kitchen_type: string;
  bathroom_type: string;

  own_electric_meter: boolean;
  own_water_meter: boolean;
  internet_ready: boolean;
  ac_ready: boolean;

  listing_type_id: number;
  amenities: number[];
  nearby_places: NearbyPlace[];
  images: File[];
  status: string;
}

export const useCreateListing = () => {
  const data = ref<CreateListingResponse | null>(null);
  const error = ref<Error | null>(null);
  const loading = ref(false);

  const createListing = async (listing: Listing) => {
    loading.value = true;
    error.value = null;

    try {
      const res = await $fetch<CreateListingResponse>("/api/host/create-listing", {
        method: "POST",
        body: listing,
      });
      data.value = res;
    } catch (err) {
      error.value = err as Error;
    } finally {
      loading.value = false;
    }
  };

  return {
    data,
    error,
    loading,
    createListing,
  };
};
