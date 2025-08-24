// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },

  runtimeConfig: {
    // Private runtime config (server-only)
    laravelApi: process.env.LARAVEL_API || "http://localhost:8000",

    // Public runtime config (available in client-side too)
    public: {
      laravelApi: process.env.LARAVEL_API || "http://localhost:8000",
    },
  },

  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/image",
    "@nuxt/content",
    "@nuxt/icon",
    "@nuxt/test-utils",
  ],
});
