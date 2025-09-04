interface ListingType {
  id: number;
  name: string;
}

interface Amenity {
  id: number;
  name: string;
}

interface Image {
  id: number;
  url: string;
  is_primary?: boolean;
  order: number;
}

interface NearbyPlace {
  id: number;
  place_name: string;
  place_type: string;
  distance: number;
  duration: number;
  mode: string;
}

interface Listing {
  id: number;
  title: string;
  description: string;
  availability: string;
  address: string;
  barangay: string;
  city: string;
  longitude: number;
  latitude: number;
  landmark: string;
  price: number;
  occupants: string;
  bedrooms: number;
  bathrooms: number;
  month_advance: boolean;
  month_deposit: boolean;
  kitchen_type: string;
  bathroom_type: string;
  own_electric_meter: boolean;
  own_water_meter: boolean;
  internet_ready: boolean;
  cable_tv: boolean;
  views: number;
  shares: number;

  // relations
  type: ListingType;
  amenities: Amenity[];
  images: Image[];
  nearbyPlaces: NearbyPlace[];
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const id = event.context.params?.id;
  const listing = await $fetch<Listing>(`${config.laravelApi}/api/listing/details`, {
    params: { id: id },
  });

  return listing;
});
