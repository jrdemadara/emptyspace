<script setup lang="ts">
import { ref } from "vue";

import me from "~/assets/img/me.jpg";
const favorites = useFavorite();
const auth = useAuth();
</script>

<template>
    <div class="fixed top-0 left-0 right-0 z-50 flex shadow-xs items-center px-8 bg-white">
        <div class="flex-none">
            <AppLogo />
        </div>

        <div class="size-14 grow">
            <nav class="flex items-center justify-start w-full h-full space-x-6 ml-16">
                <NuxtLink to="/" class="text-black hover:underline">Home</NuxtLink>
                <NuxtLink to="/about" class="text-black hover:underline">About</NuxtLink>
            </nav>
        </div>

        <div class="flex-none">
            <div class="flex space-x-1 justify-end items-center">
                <UButton label="Become a host" variant="outline" color="neutral" />
                <button
                    v-if="auth.isAuthenticated"
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
                    <Transition name="fade-scale">
                        <span
                            v-if="favorites.has()"
                            class="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"
                        ></span>
                    </Transition>
                </button>
                <div class="flex items-center justify-center hover:bg-amber-200 rounded-full p-2">
                    <UPopover class="hover:bg-amber-200">
                        <UIcon name="heroicons:user-circle" size="24" />

                        <template #content>
                            <Placeholder class="size-fit m-4 inline-flex">
                                <div v-show="!auth.isAuthenticated">
                                    <ul>
                                        <li
                                            class="flex justify-between items-center p-2 hover:bg-slate-50 font-semibold space-x-4"
                                        >
                                            <NuxtLink to="/login" class="block text-sm py-1"
                                                >Create an account</NuxtLink
                                            >

                                            <Icon
                                                name="heroicons:arrow-right-end-on-rectangle"
                                                :size="20"
                                            />
                                        </li>
                                    </ul>
                                </div>

                                <div v-show="auth.isAuthenticated" class="flex flex-col space-y-2">
                                    <div
                                        class="flex flex-col w-full justify-center items-center px-3"
                                    >
                                        <div
                                            class="flex justify-center items-center space-x-2 py-2"
                                        >
                                            <img
                                                src="~/assets/img/me.jpg"
                                                alt="User Avatar"
                                                class="rounded-full w-9 h-9"
                                            />
                                            <!-- <UAvatar :src="me" /> -->

                                            <div class="flex flex-col w-full">
                                                <span class="text-sm font-medium"
                                                    >Johnny Rogers</span
                                                >
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
                                            <a href="#" class="block text-sm py-1"> Profile </a>
                                            <Icon name="lucide:user-circle" :size="18" />
                                        </li>
                                        <li
                                            class="flex justify-between items-center py-0.5 hover:bg-gray-100 px-3"
                                        >
                                            <a href="#" class="block text-sm py-1"> Logout </a>
                                            <Icon name="lucide:log-out" :size="18" />
                                        </li>
                                    </ul>
                                </div>
                            </Placeholder>
                        </template>
                    </UPopover>
                </div>

                <UPopover>
                    <template #content>
                        <Placeholder
                            class="size-48 flex flex-col justify-center items-center m-4 space-y-2"
                        >
                            <div class="w-full flex flex-col">
                                <small class="text-slate-500">Balance</small>
                                <div class="flex justify-between items-end">
                                    <span class="flex items-center text-2xl font-bold">
                                        <Icon name="lucide:badge-cent" size="22" />100</span
                                    >
                                    <small class="text-sm text-slate-400">credits</small>
                                </div>
                            </div>
                            <UButton
                                icon="i-lucide-badge-cent"
                                size="xl"
                                color="primary"
                                variant="outline"
                                class="w-full justify-center"
                                >Use Credit</UButton
                            >
                            <UButton
                                icon="i-lucide-square-play"
                                size="xl"
                                color="neutral"
                                variant="outline"
                                class="w-full justify-center"
                                >Watch Ad</UButton
                            >
                        </Placeholder>
                    </template>
                </UPopover>
            </div>
        </div>
    </div>
</template>

<style>
.fade-scale-enter-active,
.fade-scale-leave-active {
    transition:
        opacity 0.3s ease,
        transform 0.3s ease;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
    opacity: 0;
    transform: scale(0.5);
}
.fade-scale-enter-to,
.fade-scale-leave-from {
    opacity: 1;
    transform: scale(1);
}
</style>
