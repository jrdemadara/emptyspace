<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
const route = useRoute();

definePageMeta({
    middleware: ["auth"],
});

// Generate breadcrumbs based on route path
const breadcrumbs = computed(() => {
    const segments = route.path.split("/").filter(Boolean);
    let path = "";
    return segments.map((segment) => {
        path += `/${segment}`;
        // Capitalize and replace hyphens with spaces for display
        const text = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
        return { text, path };
    });
});

const navItems = ref<NavigationMenuItem[][]>([
    [
        {
            label: "Main",
            type: "label",
        },
        {
            label: "Dashboard",
            icon: "i-lucide-circle-gauge",
            to: "/dashboard",
        },
        {
            label: "My Properties",
            icon: "i-lucide-list",
            defaultOpen: true, // open by default
            children: [
                {
                    label: "List",
                    icon: "i-lucide-file-text",
                    badge: "52",
                    to: "/listings",
                },
                {
                    label: "Create",
                    icon: "i-lucide-plus",
                    to: "/listings/create",
                },
            ],
        },
        {
            label: "Deals",
            icon: "i-lucide-heart-handshake",
            badge: "1",
            to: "/dashboard",
        },
    ],
    [
        {
            label: "Messages",
            type: "label",
        },
        {
            label: "Notification",
            icon: "i-lucide-bell",
            badge: "8",
            to: "/dashboard",
        },
        {
            label: "Chat",
            icon: "i-lucide-message-circle",
            badge: "3",
            to: "/dashboard",
        },
        {
            label: "Announcements",
            icon: "i-lucide-megaphone",
            badge: "3",
            to: "/dashboard",
        },
    ],
    [
        {
            label: "Account",
            type: "label",
        },
        {
            label: "My Account",
            icon: "i-lucide-shield-user",
            to: "/dashboard",
        },
    ],
    [
        {
            label: "External",
            type: "label",
        },
        {
            label: "Support us",
            icon: "i-lucide-hand-heart",
            to: "https://github.com/nuxt/ui",
            target: "_blank",
        },
        {
            label: "Advertise with us",
            icon: "i-lucide-circle-play",
            to: "https://github.com/nuxt/ui",
            target: "_blank",
        },
        {
            label: "Privacy Policy",
            icon: "i-lucide-hat-glasses",
            to: "https://github.com/nuxt/ui",
            target: "_blank",
        },
        {
            label: "Terms & Conditions",
            icon: "i-lucide-handshake",
            to: "https://github.com/nuxt/ui",
            target: "_blank",
        },
        {
            label: "Feedback",
            icon: "i-lucide-message-circle",
            to: "https://github.com/nuxt-ui-templates/dashboard",
            target: "_blank",
        },
        {
            label: "Author",
            icon: "i-lucide-terminal",
            to: "https://github.com/nuxt/ui",
            target: "_blank",
        },
    ],
]);
</script>

<template>
    <div class="flex h-screen bg-white dark:bg-gray-900">
        <aside
            class="w-64 bg-gray-100/60 dark:bg-gray-950/60 text-white flex justify-between items-center flex-col px-4 pb-5"
        >
            <div>
                <div class="px-4 py-7 border-b border-gray-200 dark:border-gray-800">
                    <AppLogo />
                </div>
                <UNavigationMenu
                    orientation="vertical"
                    :items="navItems"
                    class="data-[orientation=vertical]:w-56"
                />
            </div>
            <div class="space-y-5">
                <div class="flex justify-center items-center space-x-2">
                    <UAvatar src="https://github.com/benjamincanac.png" size="xl" />
                    <div class="flex flex-col">
                        <div class="text-sm font-medium text-black dark:text-white">
                            Johnny Rogers
                        </div>
                        <div class="text-xs text-gray-600 dark:text-gray-400">
                            jrdemadara@protonmail.com
                        </div>
                    </div>
                </div>
                <div class="flex space-x-3 text-black dark:text-white">
                    <UIcon name="i-lucide-facebook" />
                    <UIcon name="i-lucide-youtube" />
                    <UIcon name="i-lucide-twitter" />
                </div>
            </div>
        </aside>

        <main class="flex flex-col flex-grow">
            <!-- Top bar: breadcrumbs + actions -->
            <div
                class="flex justify-between items-center bg-gray-50 dark:bg-gray-900 py-2 px-6 shadow-xs"
            >
                <!-- Breadcrumbs -->
                <nav
                    class="flex space-x-2 text-sm text-gray-600 dark:text-gray-400"
                    aria-label="Breadcrumb"
                >
                    <NuxtLink to="/dashboard" class="hover:underline">Host</NuxtLink>
                    <span v-if="breadcrumbs.length">/</span>

                    <template v-for="(crumb, index) in breadcrumbs" :key="crumb.path">
                        <NuxtLink
                            v-if="index < breadcrumbs.length - 1"
                            :to="crumb.path"
                            class="hover:underline"
                        >
                            {{ crumb.text }}
                        </NuxtLink>

                        <span v-else class="text-slate-400">{{ crumb.text }}</span>
                        <!-- current page -->

                        <span v-if="index < breadcrumbs.length - 1">/</span>
                    </template>
                </nav>

                <!-- Actions: notification + chat -->
                <div class="flex items-center space-x-4">
                    <!-- Notification button -->
                    <UChip size="3xl">
                        <UButton icon="i-lucide-bell" color="neutral" variant="subtle" />
                    </UChip>

                    <!-- Chat button -->
                    <UChip size="3xl">
                        <UButton icon="i-lucide-message-circle" color="neutral" variant="subtle" />
                    </UChip>
                </div>
            </div>

            <!-- Page content -->
            <div class="flex-grow overflow-y-auto p-4">
                <slot />
            </div>
        </main>
    </div>
</template>

<style>
.slide-enter-active,
.slide-leave-active {
    transition: all 0.3s ease;
    overflow: hidden;
}
.slide-enter-from,
.slide-leave-to {
    max-height: 0;
    opacity: 0;
}
.slide-enter-to,
.slide-leave-from {
    max-height: 500px;
    opacity: 1;
}
</style>
