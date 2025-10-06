interface CheckEmailResponse {
  exists: boolean;
  message: string;
}

export const useCheckEmail = () => {
  const {
    data,
    pending,
    error,
    refresh: _originalRefresh,
  } = useAsyncData<CheckEmailResponse>(
    "check-email",
    () => {
      throw new Error("Use refresh(email) instead");
    },
    { immediate: false },
  );

  const refresh = async (email: string) => {
    const result = await $fetch<CheckEmailResponse>("/api/auth/check-email", {
      method: "GET",
      query: { email },
    });
    data.value = result;
    return result;
  };

  return { result: data, loading: pending, error, refresh };
};
