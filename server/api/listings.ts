interface Listing {
  title: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  views: number;
  images: { path: string }[];
  type: string;
}

export default defineEventHandler(async () => {
  const config = useRuntimeConfig();

  // Use the public or private URL
  const apiUrl = `${config.laravelApi}/api/listings`;

  const listings = await $fetch<Listing[]>(apiUrl);

  return listings.map((listing) => ({
    title: listing.title.toLowerCase(),
    description: listing.description.toLowerCase(),
    bedrooms: listing.bedrooms,
    bathrooms: listing.bathrooms,
    views: listing.views,
    price: listing.price,
    image: listing.images?.length ? listing.images[0].path : null,
    type: listing.type,
  }));
});
