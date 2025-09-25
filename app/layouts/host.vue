<script setup lang="ts">
const route = useRoute();

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
</script>

<template>
    <div class="flex min-h-screen bg-white">
        <aside class="w-64 bg-gray-950 text-white flex flex-col px-4">
            <div class="px-4 py-7 border-b border-gray-700">
                <AppLogo />
            </div>

            <!-- Navigation links -->
            <nav class="flex flex-col mt-6 space-y-2">
                <NuxtLink
                    to="/dashboard"
                    class="items-center inline-flex px-4 py-2 rounded hover:bg-gray-900"
                    active-class="bg-secondary font-semibold"
                >
                    <UIcon name="i-lucide-circle-gauge" class="mr-2" />
                    Dashboard
                </NuxtLink>

                <NuxtLink
                    to="/listings"
                    class="items-center inline-flex px-4 py-2 rounded hover:bg-gray-900"
                    active-class="bg-secondary font-semibold"
                >
                    <UIcon name="i-lucide-list" class="mr-2" />
                    Listings
                </NuxtLink>
            </nav>
        </aside>

        <main class="flex flex-col flex-grow">
            <!-- Top bar: breadcrumbs + actions -->
            <div class="flex justify-between items-center bg-slate-50 py-2 px-6 shadow-sm">
                <!-- Breadcrumbs -->
                <nav class="flex space-x-2 text-sm text-slate-600" aria-label="Breadcrumb">
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
                    <button class="relative p-2 rounded hover:bg-slate-200">
                        <UIcon name="i-lucide-bell" size="24" />
                        <span
                            class="absolute top-1 right-2 w-3 h-3 border border-slate-200 bg-red-500 rounded-full"
                        ></span>
                    </button>

                    <!-- Chat button -->
                    <button class="relative p-2 rounded hover:bg-slate-200">
                        <UIcon name="i-lucide-message-circle" size="24" />
                        <span
                            class="absolute top-1 right-1 w-3 h-3 border border-slate-200 bg-red-500 rounded-full"
                        ></span>
                    </button>
                </div>
            </div>

            <!-- Page content -->
            <div class="p-4">
                <slot />
            </div>
        </main>
    </div>
</template>
