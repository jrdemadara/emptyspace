<script setup>
import { ref } from "vue";

const menuOpen = ref(false);

function toggleMenu() {
  menuOpen.value = !menuOpen.value;
}

function logout() {
  alert("Logging out...");
}
</script>

<template>
  <div
    class="fixed top-0 left-0 right-0 z-50 flex shadow-xs items-center px-8 bg-white"
  >
    <div class="flex-none">
      <AppLogo />
    </div>

    <div class="size-14 grow">
      <nav
        class="flex items-center justify-start w-full h-full space-x-6 ml-16"
      >
        <NuxtLink to="/" class="text-black hover:underline">Home</NuxtLink>
        <NuxtLink to="/about" class="text-black hover:underline"
          >About</NuxtLink
        >
      </nav>
    </div>

    <div class="flex-none">
      <div class="flex space-x-1 justify-end items-center">
        <button class="flex items-center justify-center mr-4">
          <span class="hover:underline text-sm font-semibold"
            >Become a host</span
          >
        </button>

        <button
          class="relative flex items-center justify-center hover:bg-amber-200 rounded-full p-2"
        >
          <Icon name="heroicons:bell" size="24" />
          <span
            class="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"
          ></span>
        </button>

        <button
          class="relative flex items-center justify-center hover:bg-amber-200 rounded-full p-2"
        >
          <Icon name="heroicons:heart" size="24" />
          <span
            class="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"
          ></span>
        </button>

        <div class="relative">
          <!-- Avatar -->
          <div
            class="flex items-center justify-center rounded-full overflow-hidden cursor-pointer"
            @click="toggleMenu"
          >
            <img
              src="~/assets/img/me.jpg"
              alt="User Avatar"
              class="rounded-full w-10 h-10 border"
            />
          </div>

          <!-- Dropdown Menu -->
          <div
            v-if="menuOpen"
            class="absolute space-y-2 py-2 right-0 mt-2 bg-white w-64 border border-gray-200 rounded-lg shadow-lg"
          >
            <div class="flex flex-col w-full justify-center items-center px-3">
              <div class="flex justify-center items-center space-x-2 py-3">
                <img
                  src="~/assets/img/me.jpg"
                  alt="User Avatar"
                  class="rounded-full w-12 h-12"
                />
                <div class="flex flex-col w-full">
                  <span class="text-sm font-medium">Johnny Rogers</span>
                  <span class="text-xs text-gray-500"
                    >jrdemadara@protonmail.com</span
                  >
                </div>
              </div>
            </div>
            <hr class="border-0 h-px bg-slate-100" />
            <div class="flex justify-between items-center px-3">
              <button class="flex items-center">
                <Icon name="heroicons:plus" :size="20" />
              </button>

              <span class="text-amber-500">
                15 <small class="text-slate-800">credits</small></span
              >
            </div>
            <hr class="border-0 h-px bg-slate-100" />
            <ul>
              <li
                class="flex justify-between items-center py-0.5 hover:bg-gray-100 px-3"
              >
                <a href="#" class="block text-sm py-1 font-light"> Profile </a>
                <Icon name="heroicons:user-circle" :size="20" />
              </li>
              <li
                class="flex justify-between items-center py-0.5 hover:bg-gray-100 px-3"
              >
                <a href="#" class="block text-sm py-1 font-light"> Logout </a>
                <Icon name="heroicons:power" :size="20" />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
