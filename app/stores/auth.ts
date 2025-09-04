import { defineStore } from "pinia";

export interface User {
  id: number | null;
  first_name: string | null;
  last_name: string | null;
  screen_name: string | null;
  photo: string | null;
  email: string | null;
  phone: string | null;
  role: string | null;
  guest: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const useAuth = defineStore("auth", {
  state: () => ({
    token: null as string | null,
    user: {
      id: null,
      first_name: null,
      last_name: null,
      screen_name: null,
      photo: null,
      email: null,
      phone: null,
      role: null,
      guest: true,
    } as User,
  }),

  getters: {
    isAuthenticated: (state): boolean => !!state.token,
    isGuest: (state): boolean => state.user.guest,
    fullName: (state): string =>
      [state.user.first_name, state.user.last_name].filter(Boolean).join(" "),
  },

  actions: {
    async login(email: string, password: string) {
      try {
        const res = await $fetch<AuthResponse>("/api/login", {
          method: "POST",
          body: { email, password },
        });

        this.token = res.token;
        this.user = { ...res.user, guest: false };
      } catch (e) {
        console.error("Login failed", e);
        throw e;
      }
    },

    async register(payload: {
      first_name: string;
      last_name: string;
      screen_name: string;
      email: string;
      phone?: string;
      password: string;
    }) {
      try {
        const res = await $fetch<AuthResponse>("/api/register", {
          method: "POST",
          body: payload,
        });

        this.token = res.token;
        this.user = { ...res.user, guest: false };
      } catch (e) {
        console.error("Register failed", e);
        throw e;
      }
    },

    logout() {
      this.token = null;
      this.user = {
        id: null,
        first_name: null,
        last_name: null,
        screen_name: null,
        photo: null,
        email: null,
        phone: null,
        role: null,
        guest: true,
      };
      localStorage.removeItem("auth");
    },

    ensureGuest() {
      if (!this.user.id && this.user.guest) {
        let guestId = localStorage.getItem("guest_id");
        if (!guestId) {
          guestId = crypto.randomUUID();
          localStorage.setItem("guest_id", guestId);
        }

        this.user = {
          id: null,
          first_name: "Guest",
          last_name: guestId.slice(0, 6), // short random suffix
          screen_name: `guest_${guestId.slice(0, 6)}`,
          photo: null,
          email: null,
          phone: null,
          role: "guest",
          guest: true,
        };
      }
    },

    clear() {
      this.token = null;
      this.user = {
        id: null,
        first_name: null,
        last_name: null,
        screen_name: null,
        photo: null,
        email: null,
        phone: null,
        role: null,
        guest: true,
      };
    },
  },

  persist: true,
});
