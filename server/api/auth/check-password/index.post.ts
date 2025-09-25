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

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const body = await readBody<{ email?: string; password?: string }>(event);
  const { email, password } = body;

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Email and password are required",
    });
  }

  const response = await $fetch<CheckPasswordResponse>(
    `${config.laravelApi}/api/auth/check-password`,
    {
      method: "POST",
      body: { email, password },
    },
  );

  return response;
});
