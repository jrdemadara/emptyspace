<script setup>
import a from "@/assets/img/a.jpg";
import b from "@/assets/img/b.jpg";
import c from "@/assets/img/c.jpg";
import d from "@/assets/img/d.jpg";
import e from "@/assets/img/e.jpg";
import f from "@/assets/img/f.jpg";
import g from "@/assets/img/g.jpg";
import h from "@/assets/img/h.jpg";

const { listings, loading, error, fetchListings } = useListings();

// Fetch immediately on mount (SSR-friendly)
await fetchListings();

console.log(loading);
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
              type="text"
              class="w-full h-full px-2 outline-none focus:outline-none focus:ring-0 border-none text-sm capitalize"
            />
          </div>
        </div>
        <div
          class="flex flex-col w-1/2 h-full items-start p-3 border-e border-slate-100"
        >
          <label for="" class="text-slate-500 text-xs">Availability</label>
          <div class="flex items-center w-full">
            <Icon name="heroicons:banknotes" size="24" />
            <select
              class="w-full text-sm px-2 border-none outline-none focus:outline-none focus:ring-0 appearance-none bg-transparent"
            >
              <option>For Rent</option>
              <option>For Lease</option>
              <option>For Sale</option>
            </select>
          </div>
        </div>
        <div
          class="flex flex-col w-1/2 h-full items-start p-3 border-e border-slate-100"
        >
          <label for="" class="text-slate-500 text-xs">Type</label>
          <div class="flex items-center w-full">
            <Icon name="heroicons:home" size="24" />
            <select
              class="w-full h-full text-sm px-2 border-none outline-none focus:outline-none focus:ring-0 appearance-none bg-transparent"
            >
              <option>Apartment</option>
              <option>Bed Spacer</option>
              <option>Commercial Building</option>
              <option>Condo</option>
              <option>Office Space</option>
              <option>Room</option>
              <option>Warehouse</option>
            </select>
          </div>
        </div>

        <div
          class="flex flex-col w-1/2 h-full items-start p-3 border-e border-slate-100"
        >
          <label for="" class="text-slate-500 text-xs">Occupants</label>
          <div class="flex items-center w-full">
            <Icon name="heroicons:user-group" size="24" />
            <select
              class="w-full h-full text-sm px-2 border-none outline-none focus:outline-none focus:ring-0 appearance-none bg-transparent"
            >
              <option value="1">1 Person</option>
              <option value="2">2 People</option>
              <option value="3">3 People</option>
              <option value="4-5">4–5 People</option>
              <option value="6-7">6–7 People</option>
              <option value="8+">8+ People</option>
            </select>
          </div>
        </div>

        <div
          class="flex flex-col w-1/2 h-full items-start p-3 border-e border-slate-100"
        >
          <label for="" class="text-slate-500 text-xs">Range</label>
          <div class="flex items-center w-full">
            <Icon name="heroicons:currency-dollar" size="24" />
            <select
              class="w-full h-full text-sm px-2 border-none outline-none focus:outline-none focus:ring-0 appearance-none bg-transparent"
            >
              <option>₱0 - ₱5,000</option>
              <option>₱5,001 - ₱10,000</option>
              <option>₱10,001 - ₱20,000</option>
              <option>₱20,001 - ₱50,000</option>
              <option>₱50,001 - ₱100,000</option>
              <option>₱100,001 - ₱500,000</option>
              <option>₱500,001 - ₱1,000,000</option>
              <option>₱1,000,001+</option>
            </select>
          </div>
        </div>
        <button
          class="flex justify-center items-center w-64 h-full bg-amber-500 hover:bg-amber-500/90"
        >
          <Icon name="mdi:home-find-outline" size="32" class="text-slate-50" />
        </button>
      </div>
    </section>

    <section v-if="loading">Please wait...</section>
    <section v-else-if="error">Error: {{ error }}</section>

    <section
      v-else
      class="flex flex-col space-y-5 justify-center w-full h-full p-8 bg-white rounded-t-2xl"
    >
      <div class="flex justify-between w-full items-center">
        <h6 class="text-slate-600">
          Found <strong class="text-slate-950">1024</strong> results near
          <strong class="text-slate-950">Tacurong City</strong>
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

      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
      >
        <div
          v-for="listing in listings"
          :key="listing.title"
          class="flex flex-col shadow rounded-xl overflow-hidden w-full group"
        >
          <!-- Image (fixed half height) -->
          <div
            class="relative bg-cover bg-center w-full h-72"
            :style="{
              backgroundImage: `url(${a})`,
            }"
          >
            <!-- Dark overlay -->
            <div
              class="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition"
            ></div>

            <!-- Heart -->
            <button
              class="absolute flex top-2 right-2 bg-white/80 p-2 rounded-full transition hover:bg-amber-200/80"
            >
              <Icon name="mdi:heart-outline" class="w-5 h-5" />
            </button>
          </div>

          <!-- Content (fixed half height, clamped text) -->
          <div class="flex flex-col p-3">
            <h6 class="font-semibold line-clamp-1 mb-1">
              {{ listing.title }}
            </h6>
            <p class="text-sm text-slate-600 line-clamp-2 mb-4">
              {{ listing.description }}
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
                  <strong>{{ listing.price?.toLocaleString() }}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-between items-center w-full h-12">
        <div class="flex space-x-2">
          <div
            class="flex justify-center items-center rounded-full hover:bg-slate-100 size-12"
          >
            <span class="text-sm">1</span>
          </div>
          <div
            class="flex justify-center items-center rounded-full bg-amber-200 size-12"
          >
            <span class="text-sm">2</span>
          </div>
          <div
            class="flex justify-center items-center rounded-full hover:bg-slate-100 size-12"
          >
            <span class="text-sm">3</span>
          </div>
          <div
            class="flex justify-center items-center rounded-full hover:bg-slate-100 size-12"
          >
            <span class="text-sm">4</span>
          </div>
          <div
            class="flex justify-center items-center rounded-full hover:bg-slate-100 size-12"
          >
            <span class="text-sm">5</span>
          </div>
          <div
            class="flex justify-center items-center rounded-full hover:bg-slate-100 size-12"
          >
            <span class="text-sm">6</span>
          </div>
        </div>
        <div class="flex items-center justify-end space-x-2 w-full">
          <label for="" class="text-sm">Show:</label>
          <div
            class="flex justify-center items-center bg-slate-50 px-3 py-1 rounded"
          >
            <select
              class="h-8 text-sm border-none outline-none focus:outline-none focus:ring-0 appearance-none rounded"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="40">40</option>
              <option value="50">50</option>
            </select>
            <Icon name="heroicons-solid:chevron-down" class="w-5 h-5" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
