interface LoginResponse {
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

export const useLogin = (email: Ref<string>, password: Ref<string>) => {
  const { data, pending, error, refresh } = useAsyncData<LoginResponse>(
    "login",
    () =>
      $fetch("/api/auth/login", {
        method: "POST",
        body: {
          email: email.value,
          password: password.value,
        },
      }),
    {
      immediate: false,
    },
  );

  return {
    result: data,
    loading: pending,
    error,
    refresh,
  };
};
