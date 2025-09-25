import { useAuth } from "~/stores/auth";
import { useAsyncData } from "#imports";

interface ListingType {
  id: number;
  name: string;
  // add other fields if needed
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

interface UserListingsQuery {
  [key: string]: string | number | undefined;
}

export const useUserListings = (params: UserListingsQuery = {}) => {
  const auth = useAuth();

  return useAsyncData<UserListingsResponse>(
    `user-listings-${JSON.stringify(params)}`,
    () =>
      $fetch<UserListingsResponse>("/api/host/user-listings", {
        params,
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      }),
    { immediate: true },
  );
};
