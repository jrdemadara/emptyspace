<script setup lang="ts">
import { ref, onMounted } from "vue";

const favorites = useFavorite();

const { listings, loading, error, fetchListings, currentPage, lastPage, perPage, total } =
    useListings();

onMounted(() => {
    fetchListings({ per_page: perPage.value });
});

watch([currentPage, perPage], () => {
    console.log("last page", lastPage.value);
    console.log("perPage", perPage.value);
    fetchListings({ per_page: perPage.value });
});
const filters = ref({
    location: "",
    availability: "",
    type: "",
    occupants: "",
    range: "",
});

const applyFilters = () => {
    fetchListings(filters.value);
};
</script>

<template>
    <div class="flex flex-col">
        <section class="flex justify-center py-10 w-full">
            <div class="flex bg-white rounded-xl overflow-clip shadow-xs">
                <div
                    class="flex flex-col w-2/3 h-full items-start justify-center p-3 border-e border-slate-100"
                >
                    <label for="" class="text-slate-500 text-xs">Where</label>
                    <div class="flex items-start w-full">
                        <Icon name="heroicons:map-pin" size="24" />
                        <input
                            v-model="filters.location"
                            type="text"
                            class="w-full h-full px-2 outline-none focus:outline-none focus:ring-0 border-none text-sm capitalize"
                        />
                    </div>
                </div>
                <div class="flex flex-col w-1/2 h-full items-start p-3 border-e border-slate-100">
                    <label for="" class="text-slate-500 text-xs">Availability</label>
                    <div class="flex items-center w-full">
                        <Icon name="heroicons:banknotes" size="24" />
                        <select
                            v-model="filters.availability"
                            class="w-full text-sm px-2 border-none outline-none focus:outline-none focus:ring-0 appearance-none bg-transparent"
                        >
                            <option value="for_rent">For Rent</option>
                            <option value="for_lease">For Lease</option>
                            <option value="for_sale">For Sale</option>
                        </select>
                    </div>
                </div>
                <div class="flex flex-col w-1/2 h-full items-start p-3 border-e border-slate-100">
                    <label for="" class="text-slate-500 text-xs">Type</label>
                    <div class="flex items-center w-full">
                        <Icon name="heroicons:home" size="24" />
                        <select
                            v-model="filters.type"
                            class="w-full h-full text-sm px-2 border-none outline-none focus:outline-none focus:ring-0 appearance-none bg-transparent"
                        >
                            <option value="apartment">Apartment</option>
                            <option value="bed_spacer">Bed Spacer</option>
                            <option value="commercial_building">Commercial Building</option>
                            <option value="condo_unit">Condo Unit</option>
                            <option value="office_space">Office Space</option>
                            <option value="room">Room</option>
                            <option value="warehouse">Warehouse</option>
                            <option value="house&lot">House & Lot</option>
                            <option value="house">House</option>
                            <option value="lot">Lot</option>
                        </select>
                    </div>
                </div>

                <div class="flex flex-col w-1/2 h-full items-start p-3 border-e border-slate-100">
                    <label for="" class="text-slate-500 text-xs">Occupants</label>
                    <div class="flex items-center w-full">
                        <Icon name="heroicons:user-group" size="24" />
                        <select
                            v-model="filters.occupants"
                            class="w-full h-full text-sm px-2 border-none outline-none focus:outline-none focus:ring-0 appearance-none bg-transparent"
                        >
                            <option value="1">1 Person</option>
                            <option value="2">2 People</option>
                            <option value="3">3 People</option>
                            <option value="5">More than 5 People</option>
                        </select>
                    </div>
                </div>

                <div class="flex flex-col w-1/2 h-full items-start p-3 border-e border-slate-100">
                    <label for="" class="text-slate-500 text-xs">Range</label>
                    <div class="flex items-center w-full">
                        <Icon name="heroicons:currency-dollar" size="24" />
                        <select
                            v-model="filters.range"
                            class="w-full h-full text-sm px-2 border-none outline-none focus:outline-none focus:ring-0 appearance-none bg-transparent"
                        >
                            <option value="0-10000">₱0 - ₱10,000</option>
                            <option value="10001-50000">₱10,001 - ₱50,000</option>
                            <option value="50001-1000000">₱50,001 - ₱1,000,000</option>
                        </select>
                    </div>
                </div>
                <button
                    class="flex justify-center items-center w-64 h-full bg-amber-500 hover:bg-amber-500/90"
                    @click="applyFilters"
                >
                    <Icon
                        :name="loading ? 'eos-icons:three-dots-loading' : 'mdi:home-find-outline'"
                        size="32"
                        class="text-slate-50"
                    />
                </button>
            </div>
        </section>

        <section v-if="loading" class="flex justify-center items-center">
            <!-- <div
        class="w-12 h-12 flex items-center justify-center animate-ping mt-24"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="w-full h-full text-amber-500"
        >
          <path d="M2.5 2.5v19h19V2.5h-19zm4 4h11v11h-11V6.5z" />
        </svg>
      </div> -->
            <Icon name="eos-icons:three-dots-loading" size="100" class="text-slate-700" />
        </section>
        <section v-else-if="error">Error: {{ error }}</section>

        <section
            v-else
            class="flex flex-col space-y-5 justify-center w-full h-full p-9 bg-white rounded-t-2xl"
        >
            <div class="flex justify-between w-full items-center">
                <h6 class="text-slate-600">
                    <strong class="text-slate-950">Found {{ total }} results</strong>
                </h6>
                <div
                    class="flex justify-center rounded-full border border-slate-100 overflow-hidden"
                >
                    <button
                        class="flex items-center gap-1 text-sm px-4 py-2 hover:bg-slate-100 transition"
                    >
                        <Icon name="heroicons:map" size="20" />
                        Map View
                    </button>
                    <div class="w-px bg-slate-200"></div>
                    <button
                        class="flex items-center gap-1 text-sm px-4 py-2 bg-slate-100 hover:bg-slate-100 transition"
                    >
                        <Icon name="heroicons:squares-2x2" size="20" />
                        Card View
                    </button>
                </div>
            </div>
            <div class="bg-slate-100 h-0.5"></div>

            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <div
                    v-for="listing in listings"
                    :key="listing.id"
                    class="flex flex-col shadow rounded-xl overflow-hidden w-full group"
                >
                    <!-- Image -->
                    <div
                        class="relative bg-cover bg-center w-full h-72"
                        :style="{ backgroundImage: `url(${listing.image || '/placeholder.jpg'})` }"
                    >
                        <!-- Dark overlay -->
                        <div
                            class="absolute inset-0 group-hover:bg-black/30 transition flex items-center justify-center"
                        >
                            <NuxtLink
                                :to="`/listing/${listing.id}`"
                                class="flex justify-center items-center opacity-0 group-hover:opacity-100 text-white bg-amber-500 px-4 py-2 rounded-full font-medium transform transition-transform duration-300 hover:scale-125"
                            >
                                <Icon name="heroicons:viewfinder-circle" size="24" class="" />
                            </NuxtLink>
                        </div>

                        <!-- Heart -->
                        <button
                            class="absolute flex top-2 right-2 bg-white/80 p-2 rounded-full transition hover:bg-amber-200/80"
                            @click.stop="favorites.toggle(listing)"
                        >
                            <Icon
                                :name="
                                    favorites.hasItem(listing.id)
                                        ? 'mdi:heart'
                                        : 'mdi:heart-outline'
                                "
                                class="w-5 h-5 text-red-500"
                            />
                        </button>
                    </div>

                    <!-- Content (fixed half height, clamped text) -->
                    <div class="flex flex-col p-3">
                        <h6 class="font-semibold line-clamp-1 mb-1 capitalize">
                            {{ listing.title }}
                        </h6>
                        <p class="text-sm text-slate-600 line-clamp-2 mb-4">
                            {{
                                listing.description.charAt(0).toUpperCase() +
                                listing.description.slice(1)
                            }}
                        </p>

                        <!-- Push details to bottom -->
                        <div class="flex justify-between items-center pb-2">
                            <div class="flex space-x-4">
                                <div class="flex space-x-1 items-center text-slate-600">
                                    <Icon name="flowbite:bed-solid" class="w-5 h-5" />
                                    <small>{{ listing.bedrooms }} beds</small>
                                </div>
                                <div class="flex space-x-1 items-center text-slate-600">
                                    <Icon name="bxs:bath" class="w-5 h-5" />
                                    <small>{{ listing.bathrooms }} bath</small>
                                </div>
                            </div>
                            <div class="flex space-x-4">
                                <div class="flex space-x-1 items-center text-slate-600">
                                    <Icon name="mdi:eye" class="w-5 h-5" />
                                    <small>{{ listing.views }}</small>
                                </div>
                                <div class="flex space-x-1 items-center text-slate-950">
                                    <Icon name="fa6-solid:peso-sign" class="w-5 h-5" />
                                    <strong>{{
                                        Math.round(listing.price)?.toLocaleString()
                                    }}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex justify-between items-center w-full h-12">
                <!-- Pagination -->
                <UPagination
                    v-model:page="currentPage"
                    :total="lastPage"
                    active-color="warning"
                    active-variant="subtle"
                />

                <!-- Show per page -->
                <div class="flex items-center justify-end space-x-2">
                    <label for="perPage" class="text-sm">Show:</label>
                    <USelect
                        id="perPage"
                        v-model="perPage"
                        color="warning"
                        :items="[10, 20, 30, 40, 50]"
                        class="w-16"
                    />
                </div>
            </div>
        </section>
    </div>
</template>
