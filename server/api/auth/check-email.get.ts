interface CheckEmailResponse {
  exists: boolean;
  message: string;
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = getQuery(event);
  const email = query.email as string | undefined;

  const response = await $fetch<CheckEmailResponse>(`${config.laravelApi}/api/auth/check-email`, {
    params: { email },
  });

  return response;
});
