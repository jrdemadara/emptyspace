interface CheckEmailResponse {
  exists: boolean;
}

export const useCheckEmail = (email: string) => {
  const {
    data: result,
    pending: loading,
    error,
  } = useAsyncData<CheckEmailResponse>(
    `check-email-${email}`,
    () => $fetch(`/api/auth/check-email/${email}`), // hit Nuxt server route
    {
      immediate: false, // only call when you trigger refresh()
    },
  );

  return { result, loading, error };
};
