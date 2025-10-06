interface RegisterResponse {
  message: string;
  user?: {
    id: number;
    first_name: string;
    last_name: string;
    screen_name: string;
    photo?: string | null;
    email: string;
    phone: string;
    role: string;
  };
  token?: string;
}

export const useRegister = () => {
  const { data, pending, error } = useAsyncData<RegisterResponse>(
    "register",
    () => {
      throw new Error("Use refresh(payload) instead");
    },
    { immediate: false },
  );

  const refresh = async (payload: {
    first_name?: string;
    last_name?: string;
    display_name?: string;
    email?: string;
    phone?: string;
    password?: string;
    role?: string;
  }) => {
    const result = await $fetch<RegisterResponse>("/api/auth/register", {
      method: "POST",
      body: payload,
    });
    data.value = result;
    return result;
  };

  return { result: data, loading: pending, error, refresh };
};
