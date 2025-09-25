import { useAuth } from "~/stores/auth";

export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuth();

  // Check if user is authenticated
  if (auth.isAuthenticated) {
    return navigateTo("/dashboard");
  }
});
