interface CheckPasswordResponse {
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

export const useCheckPassword = (email: string, password: string) => {
  return useAsyncData<CheckPasswordResponse>(
    "check-password",
    () =>
      $fetch("/api/auth/check-password", {
        method: "POST",
        body: { email, password },
      }),
    { immediate: false },
  );
};
