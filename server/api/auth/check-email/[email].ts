interface CheckEmailResponse {
  exists: boolean;
  message: string;
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const email = event.context.params?.email;

  if (!email) {
    throw createError({
      statusCode: 400,
      statusMessage: "Email parameter is required",
    });
  }

  const response = await $fetch<CheckEmailResponse>(`${config.laravelApi}/api/auth/check-email`, {
    params: { email },
  });

  return response;
});
