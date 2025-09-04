interface Listing {
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

interface PaginatedListings {
  current_page: number;
  data: Listing[];
  last_page: number;
  per_page: number;
  total: number;
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const query = getQuery(event);

  const response = await $fetch<PaginatedListings>(`${config.laravelApi}/api/listings`, {
    params: query,
  });

  return {
    current_page: response.current_page,
    last_page: response.last_page,
    per_page: response.per_page,
    total: response.total,
    data: response.data.map((listing) => ({
      id: listing.id,
      title: listing.title.toLowerCase(),
      description: listing.description.toLowerCase(),
      bedrooms: listing.bedrooms,
      bathrooms: listing.bathrooms,
      views: listing.views,
      price: listing.price,
      image: listing.image,
      type: listing.type,
    })),
  };
});
