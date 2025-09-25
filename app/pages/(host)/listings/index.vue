<script setup>
import { useUserListings } from "@/composables/host/useUserListings";

definePageMeta({
    layout: "host",
    middleware: ["auth"],
});

const items = ref([
    [
        {
            label: "Profile",
            icon: "i-lucide-user",
        },
        {
            label: "Billing",
            icon: "i-lucide-credit-card",
        },
        {
            label: "Settings",
            icon: "i-lucide-cog",
            kbds: [","],
        },
        {
            label: "Keyboard shortcuts",
            icon: "i-lucide-monitor",
        },
    ],
]);

const { data, pending, error } = useUserListings();
</script>
<template>
    <div>
        <div v-if="pending">Loading...</div>
        <div v-else-if="error">{{ error.message }}</div>
        <div v-else class="flex flex-col space-y-5">
            <div class="flex w-full justify-between">
                <div class="flex rounded bg-gray-50 w-52"></div>
                <UButton
                    icon="i-lucide-plus"
                    size="xl"
                    color="secondary"
                    variant="solid"
                    class="px-5 justify-center"
                    >Create Listing</UButton
                >
            </div>
            <ul class="space-y-4">
                <li
                    v-for="listing in data.data"
                    :key="listing.id"
                    class="border rounded-xl border-gray-300 flex"
                >
                    <img
                        v-if="listing.image"
                        :src="listing.image"
                        alt="Listing Image"
                        class="size-38 object-cover rounded-tl-lg rounded-bl-lg"
                    />
                    <div
                        class="flex flex-col border-e border-gray-300 p-2 items-start justify-between w-full"
                    >
                        <div class="flex flex-col">
                            <span class="font-bold text-lg capitalize">{{ listing.title }}</span>
                            <small class="text-gray-500 capitalize font-semibold">
                                {{ listing.type.name }}
                            </small>
                        </div>
                        <small class="text-gray-500 capitalize line-clamp-2">
                            {{ listing.description }}
                        </small>
                        <p class="font-semibold text-sm uppercase text-info">
                            {{ listing.availability.replace(/_/g, " ") }}
                        </p>
                    </div>

                    <div
                        class="flex flex-col justify-between border-e border-gray-300 py-2 px-5 w-full"
                    >
                        <div class="flex space-x-5 justify-between">
                            <div class="flex flex-col">
                                <span class="font-bold text-lg capitalize">{{
                                    listing.address
                                }}</span>
                                <small class="text-gray-500">Location</small>
                            </div>
                            <div class="flex flex-col">
                                <span class="font-bold text-lg capitalize">{{
                                    listing.created_at
                                }}</span>
                                <small class="text-gray-500">Listed</small>
                            </div>
                        </div>

                        <div class="flex space-x-5 justify-between">
                            <div class="flex flex-col">
                                <span class="font-bold text-lg capitalize text-success">
                                    ₱{{ Math.round(listing.price)?.toLocaleString() }}
                                </span>

                                <small class="text-gray-500">Price</small>
                            </div>
                            <div class="flex flex-col">
                                <span class="font-bold text-lg capitalize text-center">
                                    {{ listing.occupants }}
                                </span>
                                <small class="text-gray-500">Occupants</small>
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-col justify-between py-2 px-5 w-full">
                        <div class="flex space-x-5 justify-between">
                            <div class="flex flex-col">
                                <div class="inline-flex items-center space-x-1">
                                    <span
                                        class="w-3 h-3 rounded-full"
                                        :class="{
                                            'bg-gray-500': listing.status === 'draft',
                                            'bg-green-600': listing.status === 'available',
                                            'bg-orange-500': listing.status === 'unavailable',
                                            'bg-red-600': listing.status === 'sold',
                                            'bg-blue-600': listing.status === 'rented',
                                            'bg-gray-400': listing.status === 'archived',
                                        }"
                                    />

                                    <span
                                        class="font-bold text-lg capitalize"
                                        :class="{
                                            'text-gray-500': listing.status === 'draft',
                                            'text-green-600': listing.status === 'available',
                                            'text-orange-500': listing.status === 'unavailable',
                                            'text-red-600': listing.status === 'sold',
                                            'text-blue-600': listing.status === 'rented',
                                            'text-gray-500': listing.status === 'archived',
                                        }"
                                    >
                                        {{ listing.status }}
                                    </span>
                                </div>

                                <small class="text-gray-500">Status</small>
                            </div>
                            <UDropdownMenu class="h-fit" :items="items">
                                <UButton
                                    icon="i-lucide-ellipsis"
                                    color="neutral"
                                    variant="subtle"
                                />
                            </UDropdownMenu>
                        </div>

                        <div class="flex space-x-5 justify-between">
                            <div class="flex items-center space-x-5">
                                <div class="inline-flex space-x-1">
                                    <UIcon name="i-lucide-heart" size="24" />
                                    <span>{{ listing.views }}</span>
                                </div>
                                <div class="inline-flex space-x-1">
                                    <UIcon name="i-lucide-eye" size="24" />
                                    <span>{{ listing.views }}</span>
                                </div>
                            </div>
                            <UButton color="neutral" class="w-32 justify-center">Edit</UButton>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
