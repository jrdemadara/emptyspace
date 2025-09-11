import { defineStore } from "pinia";

export type AuthStep = "check" | "login" | "register";

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
    step: "check" as AuthStep,
    email: "" as string,

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
    // Store only updates state — composables will call APIs
    setEmail(email: string) {
      this.email = email;
    },

    setStep(step: AuthStep) {
      this.step = step;
    },

    setAuth(res: AuthResponse) {
      this.token = res.token;
      this.user = { ...res.user, guest: false };
      this.step = "check";
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
      this.step = "check";
      this.email = "";
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
          last_name: guestId.slice(0, 6),
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
      this.step = "check";
      this.email = "";
    },
  },

  persist: true,
});
