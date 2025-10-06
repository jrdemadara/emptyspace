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

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const body = await readBody<{ email?: string; password?: string }>(event);
  const { email, password } = body;

  const response = await $fetch<LoginResponse>(`${config.laravelApi}/api/auth/check-password`, {
    method: "POST",
    body: { email, password },
  });

  return response;
});
