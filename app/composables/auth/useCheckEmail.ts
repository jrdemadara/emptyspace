interface CheckEmailResponse {
  exists: boolean;
  message: string;
}

export const useCheckEmail = (email: string) => {
  const {
    data: result,
    pending: loading,
    error,
    refresh,
  } = useAsyncData<CheckEmailResponse>(
    `check-email-${email}`,
    () => $fetch(`/api/auth/check-email/${email}`),
    {
      immediate: false,
    },
  );

  return { result, loading, error, refresh };
};
