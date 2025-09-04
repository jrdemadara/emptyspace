<script setup lang="ts">
import { useRoute } from "vue-router";
import { useListingDetails } from "@/composables/useListingDetails";

const route = useRoute();
const id = Number(route.params.id);
const favorites = useFavorite();
const auth = useAuth();
const shareUrl = `https://emptyspace.com/listings/${route.params.id}`;
const copied = ref(false);

const { listing, loading, error, refresh } = useListingDetails(id);

const copyLink = async () => {
    try {
        await navigator.clipboard.writeText(shareUrl);
        copied.value = true;
        setTimeout(() => {
            copied.value = false;
        }, 3000); // back to copy after 3s
    } catch (err) {
        console.error("Failed to copy: ", err);
    }
};

const getModeIcon = (mode: string) => {
    switch (mode) {
        case "walk":
            return "lucide:footprints"; // pick an appropriate icon
        case "drive":
            return "lucide:car-front";
        case "bike":
            return "lucide:bike";
        case "transit":
            return "lucide:bus-front";
        default:
            return "lucide:circle-question-mark";
    }
};
</script>
<template>
    <div v-if="loading" class="flex items-center justify-center w-full h-full p-24">
        <USkeleton class="h-24 w-24 rounded-full" />

        <div class="grid gap-5">
            <USkeleton class="h-4 w-[250px]" />
            <USkeleton class="h-4 w-[200px]" />
        </div>
    </div>
    <div v-else-if="error" class="text-black w-full">⚠️ {{ error.message }}</div>
    <div v-else-if="listing" class="flex flex-col p-9 bg-white space-y-8">
        <div class="flex justify-between items-end">
            <div class="flex flex-col space-y-1">
                <UBadge
                    class="capitalize w-fit animate-bounce"
                    icon="lucide:tags"
                    variant="subtle"
                    >{{ listing.availability.replace(/_/g, " ") }}</UBadge
                >
                <div class="inline-flex font-bold text-2xl capitalize">
                    <span>{{ listing.title }}</span>
                </div>
                <div class="flex space-x-3 items-center">
                    <UBadge
                        icon="i-lucide-map-pin"
                        size="lg"
                        color="neutral"
                        variant="subtle"
                        class="capitalize"
                    >
                        {{ listing.address }}, {{ listing.barangay }}, {{ listing.city }}
                    </UBadge>

                    <UBadge icon="i-lucide-eye" size="lg" color="neutral" variant="subtle">{{
                        listing.views
                    }}</UBadge>

                    <UBadge icon="i-lucide-share-2" size="lg" color="neutral" variant="subtle">{{
                        listing.shares
                    }}</UBadge>
                </div>
            </div>

            <div class="flex justify-end items-end space-x-3">
                <UButton
                    :icon="
                        favorites.hasItem(Number(route.params.id))
                            ? 'mdi:heart'
                            : 'mdi:heart-outline'
                    "
                    size="xl"
                    color="neutral"
                    variant="subtle"
                    class="w-32 justify-center transition-all duration-300 ease-in-out"
                    :class="
                        favorites.hasItem(Number(route.params.id)) ? 'text-red-500' : 'text-black'
                    "
                    @click="
                        favorites.toggle({
                            id: listing.id,
                            title: listing.title,
                            description: listing.description,
                            bedrooms: listing.bedrooms,
                            bathrooms: listing.bathrooms,
                            views: listing.views,
                            price: listing.price,
                            image: listing.images?.find((img) => img.is_primary)?.url ?? null,
                            type: listing.type.name,
                        })
                    "
                >
                    <span class="text-black">
                        {{ favorites.hasItem(Number(route.params.id)) ? "Liked" : "Like" }}
                    </span>
                </UButton>

                <UPopover>
                    <UButton
                        label="Share"
                        icon="i-lucide-share-2"
                        size="xl"
                        color="neutral"
                        variant="subtle"
                        class="w-32 justify-center"
                    />

                    <template #content>
                        <Placeholder class="flex flex-col w-fit p-4 space-y-2">
                            <h4 class="font-semibold text-sm">Share with:</h4>
                            <div class="flex justify-center items-center space-x-2">
                                <UButton
                                    :to="`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`"
                                    target="_blank"
                                    icon="logos:facebook"
                                    size="xl"
                                    color="neutral"
                                    variant="outline"
                                />

                                <UButton
                                    :to="`fb-messenger://share?link=${shareUrl}`"
                                    target="_blank"
                                    icon="logos:messenger"
                                    size="xl"
                                    color="neutral"
                                    variant="outline"
                                />

                                <UButton
                                    :to="`https://wa.me/?text=${shareUrl}`"
                                    target="_blank"
                                    icon="logos:whatsapp-icon"
                                    size="xl"
                                    color="neutral"
                                    variant="outline"
                                />

                                <UButton
                                    :to="`https://x.com/intent/tweet?url=${shareUrl}&text=${encodeURIComponent('Check this out!')}`"
                                    target="_blank"
                                    icon="pajamas:twitter"
                                    size="xl"
                                    color="neutral"
                                    variant="outline"
                                />

                                <UButton
                                    :to="`https://bsky.app/intent/compose?text=${encodeURIComponent(`Check this out! ${shareUrl}`)}`"
                                    target="_blank"
                                    icon="logos:bluesky"
                                    size="xl"
                                    color="neutral"
                                    variant="outline"
                                />

                                <UButton
                                    :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
                                    size="xl"
                                    :color="copied ? 'success' : 'neutral'"
                                    :variant="copied ? 'solid' : 'outline'"
                                    @click="copyLink"
                                />
                            </div>
                        </Placeholder>
                    </template>
                </UPopover>

                <UPopover>
                    <UButton
                        label="View Host Contact"
                        size="xl"
                        variant="ghost"
                        class="justify-center w-48 font-bold bg-amber-500 text-white hover:bg-amber-500/90"
                    />

                    <template #content>
                        <Placeholder>
                            <div
                                v-if="auth.isAuthenticated"
                                class="size-48 flex flex-col justify-center items-center m-4 space-y-3"
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
                            </div>

                            <div
                                v-else
                                class="flex flex-col justify-center items-center p-4 space-y-3"
                            >
                                <UButton
                                    icon="lucide:log-in"
                                    size="xl"
                                    color="neutral"
                                    variant="outline"
                                    class="w-full justify-center"
                                    >Sign in</UButton
                                >
                            </div>
                        </Placeholder>
                    </template>
                </UPopover>
            </div>
        </div>

        <div class="wh-full grid grid-cols-3 gap-4">
            <!-- Left big image (primary) -->
            <div class="col-span-2">
                <img
                    :src="listing.images.find((img) => img.is_primary)?.url"
                    alt="Primary Image"
                    class="w-full h-full object-cover rounded-lg hover:brightness-75 transition duration-500 delay-75"
                />
            </div>

            <!-- Right stacked images -->
            <div class="grid grid-rows-2 gap-4">
                <div>
                    <img
                        :src="
                            listing.images
                                .filter((img) => !img.is_primary)
                                .sort((a, b) => a.order - b.order)[0]?.url
                        "
                        alt="Secondary Image 1"
                        class="w-full h-full object-cover rounded-lg hover:brightness-75 transition duration-500 delay-75"
                    />
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <img
                        :src="
                            listing.images
                                .filter((img) => !img.is_primary)
                                .sort((a, b) => a.order - b.order)[1]?.url
                        "
                        alt="Secondary Image 2"
                        class="w-full h-full object-cover rounded-lg hover:brightness-75 transition duration-500 delay-75"
                    />
                    <img
                        :src="
                            listing.images
                                .filter((img) => !img.is_primary)
                                .sort((a, b) => a.order - b.order)[2]?.url
                        "
                        alt="Secondary Image 3"
                        class="w-full h-full object-cover rounded-lg hover:brightness-75 transition duration-500 delay-75"
                    />
                </div>
            </div>
        </div>

        <div class="bg-slate-100 h-0.5"></div>
        <div class="flex justify-between space-x-2">
            <div class="flex flex-col space-y-8">
                <div class="flex flex-col space-y-2">
                    <h4 class="font-bold text-xl capitalize">Description:</h4>
                    <p>
                        {{ listing.description }}
                    </p>
                </div>

                <div class="grid grid-cols-4 gap-4">
                    <UBadge
                        icon="heroicons-users"
                        trailing-icon="heroicons-check"
                        size="lg"
                        class="w-fit"
                        variant="subtle"
                        color="neutral"
                        >Occupants: {{ listing.occupants }}</UBadge
                    >

                    <UBadge
                        icon="lucide:bed-single"
                        trailing-icon="heroicons-check"
                        size="lg"
                        class="w-fit"
                        variant="subtle"
                        color="neutral"
                        >Bedrooms: {{ listing.bedrooms }}</UBadge
                    >

                    <UBadge
                        icon="lucide:toilet"
                        trailing-icon="heroicons-check"
                        size="lg"
                        class="w-fit"
                        variant="subtle"
                        color="neutral"
                        >Restrooms: {{ listing.bathrooms }}</UBadge
                    >

                    <UBadge
                        icon="lucide:calendar-plus"
                        trailing-icon="heroicons-check"
                        size="lg"
                        class="w-fit"
                        variant="subtle"
                        color="neutral"
                        >Month Advance: {{ listing.month_advance }}</UBadge
                    >

                    <UBadge
                        icon="lucide:calendar-arrow-down"
                        trailing-icon="heroicons-check"
                        size="lg"
                        class="w-fit"
                        variant="subtle"
                        color="neutral"
                        >Month Deposit: {{ listing.month_deposit }}</UBadge
                    >

                    <UBadge
                        icon="lucide:utensils"
                        trailing-icon="heroicons-check"
                        size="lg"
                        class="w-fit"
                        variant="subtle"
                        color="neutral"
                        >Kitchen Type: {{ listing.kitchen_type }}</UBadge
                    >

                    <UBadge
                        icon="lucide:bath"
                        trailing-icon="heroicons-check"
                        size="lg"
                        class="w-fit"
                        variant="subtle"
                        color="neutral"
                        >Bath Type: {{ listing.bathroom_type }}</UBadge
                    >

                    <UBadge
                        icon="lucide:plug-zap"
                        :trailing-icon="
                            listing.own_electric_meter ? 'heroicons:check' : 'heroicons:x-mark'
                        "
                        size="lg"
                        class="w-fit"
                        variant="subtle"
                        color="neutral"
                        >Own Electric Meter:</UBadge
                    >

                    <UBadge
                        icon="lucide:droplets"
                        :trailing-icon="
                            listing.own_water_meter ? 'heroicons:check' : 'heroicons:x-mark'
                        "
                        size="lg"
                        class="w-fit"
                        variant="subtle"
                        color="neutral"
                    >
                        Own Water Meter:</UBadge
                    >

                    <UBadge
                        icon="lucide:wifi"
                        :trailing-icon="
                            listing.internet_ready ? 'heroicons:check' : 'heroicons:x-mark'
                        "
                        size="lg"
                        class="w-fit"
                        variant="subtle"
                        color="neutral"
                    >
                        Internet Ready:</UBadge
                    >

                    <UBadge
                        icon="lucide:tv"
                        :trailing-icon="listing.cable_tv ? 'heroicons:check' : 'heroicons:x-mark'"
                        size="lg"
                        class="w-fit"
                        variant="subtle"
                        color="neutral"
                    >
                        Cable TV Ready:</UBadge
                    >
                </div>

                <div class="flex flex-col space-y-2">
                    <h4 class="font-bold text-xl capitalize">Amenities:</h4>
                    <div class="grid grid-cols-5 gap-4">
                        <UBadge
                            v-for="(amenity, index) in listing.amenities"
                            :key="index"
                            icon="lucide:sparkles"
                            :trailing-icon="
                                listing.cable_tv ? 'heroicons:check' : 'heroicons:x-mark'
                            "
                            size="lg"
                            class="capitalize max-w-[280px] truncate whitespace-nowrap w-fit"
                            variant="subtle"
                            color="neutral"
                        >
                            {{ amenity.name }}
                        </UBadge>
                    </div>
                </div>
            </div>

            <div class="flex flex-col w-1/3 space-y-4">
                <div class="rounded-lg overflow-hidden w-full h-64">
                    <MapboxMap
                        map-id="listing-map"
                        class="w-full h-full rounded-lg hover:shadow-lg"
                        :options="{
                            style: 'mapbox://styles/mapbox/light-v11',
                            center: [Number(listing.longitude), Number(listing.latitude)],
                            zoom: 14,
                        }"
                    >
                        <!-- <MapboxDefaultMarker
                            marker-id="listing-marker"
                            :lnglat="[Number(listing.longitude), Number(listing.latitude)]"
                            :options="{ color: 'red' }"
                        /> -->

                        <!-- <MapboxDefaultPopup
                            popup-id="listing-popup"
                            :lnglat="[Number(listing.longitude), Number(listing.latitude)]"
                            :options="{ closeOnClick: true }"
                        >
                            <div class="p-2">
                                <h2 class="font-bold text-lg">{{ listing.title }}</h2>
                                <p>{{ listing.address }}</p>
                                <p class="text-sm text-gray-500">₱{{ listing.price }}</p>
                            </div>
                        </MapboxDefaultPopup> -->
                    </MapboxMap>
                </div>
                <div class="flex flex-col space-y-2">
                    <div class="inline-flex items-center w-full space-x-1">
                        <Icon name="lucide-map-pinned" size="20" />
                        <span class="capitalize font-bold">{{ listing.landmark }}</span>
                    </div>

                    <div class="flex flex-col space-y-1">
                        <h4 class="font-bold text-sm capitalize">Nearby Places:</h4>
                        <div
                            v-for="(places, index) in listing.nearby_places"
                            :key="index"
                            class="inline-flex cursor-default rounded hover:bg-slate-50 items-center justify-between whitespace-nowrap space-x-4 w-full capitalize font-medium"
                        >
                            <div class="inline-flex items-center w-1/2 text-sm space-x-2">
                                <Icon name="lucide-map-pin" size="20" />
                                <span>{{ places.place_name }}</span>
                            </div>
                            <div class="flex justify-between items-center w-1/2 text-sm">
                                <span class="flex w-full justify-start lowercase"
                                    >{{ places.distance }}km</span
                                >
                                <span class="flex w-full justify-start lowercase">
                                    {{ places.duration }}min
                                </span>
                                <span><Icon :name="getModeIcon(places.mode)" size="18" /></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
