import { getQuery } from "h3";

interface ListingType {
  id: number;
  name: string;
}

interface Listing {
  id: number;
  title: string;
  description: string;
  availability: string;
  address: string;
  barangay: string;
  city: string;
  price: number;
  views: number;
  status: string;
  occupants: string;
  image: string | null;
  type: ListingType | null;
  created_at: string;
}

interface UserListingsResponse {
  data: Listing[];
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = getQuery(event);

  const token = event.req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const response = await $fetch<UserListingsResponse>(
    `${config.laravelApi}/api/listing/fetch-listings`,
    {
      params: query,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return {
    data: response.data.map((listing) => ({
      id: listing.id,
      title: listing.title.toLowerCase(),
      description: listing.description.toLowerCase(),
      availability: listing.availability,
      address: listing.address,
      barangay: listing.barangay,
      city: listing.city,
      price: listing.price,
      views: listing.views,
      status: listing.status,
      image: listing.image,
      type: listing.type,
      created_at: listing.created_at,
      occupants: listing.occupants,
    })),
  };
});
