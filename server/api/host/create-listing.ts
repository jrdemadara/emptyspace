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

interface Listing {
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

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const body = await readBody<Listing>(event);

  // Build FormData instead of JSON
  const formData = new FormData();

  Object.entries(body).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (item instanceof File) {
          formData.append(`${key}[]`, item);
        } else {
          formData.append(`${key}[${index}]`, String(item));
        }
      });
    } else if (value instanceof File) {
      formData.append(`${key}[]`, value);
    } else if (value !== null && value !== undefined) {
      formData.append(key, String(value));
    }
  });

  const response = await $fetch<CreateListingResponse>(`${config.laravelApi}/api/listing/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`, // ✅ auth header
    },
    body: formData,
  });

  return response;
});
