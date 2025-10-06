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

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  // read body from POST request
  const body = await readBody<{
    first_name?: string;
    last_name?: string;
    display_name?: string;
    email?: string;
    phone?: string;
    password?: string;
    role?: string;
  }>(event);

  // forward request to Laravel backend
  const response = await $fetch<RegisterResponse>(`${config.laravelApi}/api/auth/register`, {
    method: "POST",
    body,
  });

  return response;
});
