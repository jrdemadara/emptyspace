<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent, SelectItem, TableColumn } from "@nuxt/ui";
import type { Row } from "@tanstack/vue-table";
import mapboxgl, { Map } from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import type { GeocoderResult } from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

definePageMeta({
    layout: "host",
    middleware: ["auth"],
});

const config = useRuntimeConfig();

const toast = useToast();

const availability = ["For Sale", "For Lease", "For Rent"];
const type = ["Private", "Shared", "None"];
const status = ["Draft", "Available"];

const mode = ["Walk", "Drive", "Bike", "Transit"];
const placeType = ["Mall", "Pharmacy", "School", "Hospital", "Transport", "Other"];

const amenitiesOptions = ref<SelectItem[]>([
    {
        label: "Parking",
        id: "parking",
    },
    {
        label: "Gym",
        id: "gym",
    },
    {
        label: "Free Wifi",
        id: "free_wifi",
    },
    {
        label: "Laundry Service",
        id: "laundry_service",
    },
]);
const availabilityOptions = ref([["For Sale", "For Lease", "For Rent"]]);

const typeOptions = ref([["Private", "Shared", "None"]]);

const placesOptions = ref([["Mall", "Pharmacy", "School", "Hospital", "Transport", "Other"]]);

const modeOptions = ref([["Walk", "Drive", "Bike", "Transit"]]);

const schema = z.object({
    title: z
        .string()
        .min(6, "Title must be at least 6 characters")
        .max(100, "Title must be at most 100 characters"),
    description: z.string().optional(),
    availability: z.enum(availability),
    price: z.number().min(0, "Price must be greater than or equal to 0"),

    occupants: z
        .number()
        .min(1, "Occupants must be at least 1")
        .max(50, "Occupants must be at most 50"),

    bedrooms: z
        .number()
        .min(1, "Bedrooms must be at least 1")
        .max(50, "Bedrooms must be at most 50"),
    bathrooms: z
        .number()
        .min(1, "Bathrooms must be at least 1")
        .max(50, "Bathrooms must be at most 50"),
    month_advance: z
        .number()
        .min(0, "Month advance must be at least 0")
        .max(6, "Month advance must be at most 6")
        .default(0),
    month_deposit: z
        .number()
        .min(0, "Month deposit must be at least 0")
        .max(6, "Month deposit must be at most 6")
        .default(0),

    own_electric_meter: z.boolean().default(false),
    own_water_meter: z.boolean().default(false),
    internet_ready: z.boolean().default(false),
    cable_tv: z.boolean().default(false),
    kitchen_type: z.enum(type),
    bathroom_type: z.enum(type),

    address: z
        .string("Invalid address")
        .min(6, "Address must be at least 6 characters")
        .max(100, "Address must be at most 100 characters"),
    barangay: z
        .string("Invalid barangay")
        .min(6, "Barangay must be at least 6 characters")
        .max(100, "Barangay must be at most 100 characters"),
    city: z
        .string("Invalid city")
        .min(6, "City must be at least 6 characters")
        .max(100, "City must be at most 100 characters"),
    landmark: z
        .string("Invalid landmark")
        .min(6, "Landmark must be at least 6 characters")
        .max(100, "Landmark must be at most 100 characters"),
    longitude: z
        .number()
        .min(-180, "Longitude must be between -180 and 180")
        .max(180, "Longitude must be between -180 and 180"),
    latitude: z
        .number()
        .min(-90, "Latitude must be between -90 and 90")
        .max(90, "Latitude must be between -90 and 90"),

    amenities: z.array(z.string()).optional(),
    status: z.enum(status),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
    title: undefined,
    description: undefined,
    availability: undefined,
    price: undefined,

    occupants: undefined,
    bedrooms: undefined,
    bathrooms: undefined,
    month_advance: undefined,
    month_deposit: undefined,
    own_electric_meter: undefined,
    own_water_meter: undefined,
    internet_ready: undefined,
    cable_tv: undefined,

    kitchen_type: undefined,
    bathroom_type: undefined,

    address: undefined,
    barangay: undefined,
    city: undefined,
    landmark: undefined,
    longitude: undefined,
    latitude: undefined,
    amenities: undefined,

    status: undefined,
});

const nearbyPlaceSchema = z.object({
    place_name: z.string().min(1, "Place name is required"),
    place_type: z.enum(placeType),
    distance: z.number().min(0).nullable(),
    duration: z.number().min(0).nullable(),
    mode: z.enum(mode),
});
type NearbyPlace = z.infer<typeof nearbyPlaceSchema>;

const nearbyPlacesModalOpen = ref(false);
const editIndex = ref<number | null>(null);

const stateNearbyPlaces = reactive<Partial<NearbyPlace>>({
    place_name: undefined,
    place_type: undefined,
    distance: undefined,
    duration: undefined,
    mode: undefined,
});

const nearbyPlacesList = ref<NearbyPlace[]>([]);

// Handle submit inside modal
function handleNearbyPlaceSubmit() {
    try {
        const parsed = nearbyPlaceSchema.parse(stateNearbyPlaces);

        if (editIndex.value !== null) {
            // update existing
            nearbyPlacesList.value[editIndex.value] = parsed;
            toast.add({ title: "Place updated", color: "success" });
        } else {
            // add new
            nearbyPlacesList.value.push(parsed);
            toast.add({ title: "Place added", color: "success" });
        }

        resetNearbyPlaceForm();
        nearbyPlacesModalOpen.value = false;
    } catch (err) {
        console.error(err);
        toast.add({
            title: "Oops!",
            description: "Some required fields are empty. Please fill them in and try again.",
            color: "error",
        });
    }
}

function resetNearbyPlaceForm() {
    stateNearbyPlaces.place_name = undefined;
    stateNearbyPlaces.place_type = undefined;
    stateNearbyPlaces.distance = undefined;
    stateNearbyPlaces.duration = undefined;
    stateNearbyPlaces.mode = undefined;
    editIndex.value = null;
}

// Actions
function editPlace(row: Row<NearbyPlace>) {
    const place = row.original;
    stateNearbyPlaces.place_name = place.place_name;
    stateNearbyPlaces.place_type = place.place_type;
    stateNearbyPlaces.distance = place.distance;
    stateNearbyPlaces.duration = place.duration;
    stateNearbyPlaces.mode = place.mode;
    editIndex.value = row.index;
    nearbyPlacesModalOpen.value = true;
}

function deletePlace(row: Row<NearbyPlace>) {
    nearbyPlacesList.value.splice(row.index, 1);
    toast.add({ title: "Place deleted", color: "success" });
}

// Table columns
const columns: TableColumn<NearbyPlace>[] = [
    { accessorKey: "place_name", header: "Place" },
    { accessorKey: "place_type", header: "Type" },
    {
        accessorKey: "distance",
        header: "Distance (km)",
        cell: ({ row }) => row.getValue("distance") ?? "-",
    },
    {
        accessorKey: "duration",
        header: "Duration (min)",
        cell: ({ row }) => row.getValue("duration") ?? "-",
    },
    { accessorKey: "mode", header: "Mode" },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) =>
            h("div", { class: "flex gap-2" }, [
                h(
                    "button",
                    {
                        class: "text-blue-600  hover:underline",
                        onClick: () => editPlace(row),
                    },
                    "Edit",
                ),
                h(
                    "button",
                    {
                        class: "text-red-600 hover:underline",
                        onClick: () => deletePlace(row),
                    },
                    "Delete",
                ),
            ]),
    },
];

// Your form state
const addressState = reactive({
    address: "",
    barangay: "",
    city: "",
    landmark: "",
    longitude: undefined as number | undefined,
    latitude: undefined as number | undefined,
});

// Temp holder for pending suggestion
const pendingAddress = ref<{
    place_name: string;
    lng: number;
    lat: number;
    context: any[];
} | null>(null);

const mapModalOpen = ref(false);

let map: mapboxgl.Map;

onMounted(() => {
    mapboxgl.accessToken = config.public.mapboxToken;

    // Init map
    map = new mapboxgl.Map({
        container: "mini-map",
        style: "mapbox://styles/mapbox/streets-v11",
        center: [121.0, 14.6], // default Manila
        zoom: 12,
    });

    // Add geocoder
    const geocoder = new MapboxGeocoder({
        accessToken:
            "pk.eyJ1Ijoiam9obm55cm9nZXJzIiwiYSI6ImNtYW5jNGRlcjBzZjEyaXM0bXRuaXE3eDIifQ.9Sl7B33OcqBAHXUiXGAveA",

        marker: false,
        placeholder: "Search for an address...",
    });

    map.addControl(geocoder);

    geocoder.on("result", (e: { result: GeocoderResult }) => {
        const r = e.result;
        pendingAddress.value = {
            place_name: r.place_name,
            lng: r.geometry.coordinates[0],
            lat: r.geometry.coordinates[1],
            context: r.context || [],
        };

        mapModalOpen.value = true;

        // Create preview map inside modal
        // setTimeout(() => {
        //     new mapboxgl.Map({
        //         container: "confirm-map",
        //         style: "mapbox://styles/mapbox/dark-v10",
        //         center: [r.geometry.coordinates[0], r.geometry.coordinates[1]],
        //         zoom: 15,
        //     }).addControl(
        //         new mapboxgl.Marker().setLngLat([
        //             r.geometry.coordinates[0],
        //             r.geometry.coordinates[1],
        //         ]),
        //     );
        // }, 200);
    });
});

function confirmAddress() {
    if (!pendingAddress.value) return;

    const { place_name, lng, lat, context } = pendingAddress.value;

    state.address = place_name;
    state.longitude = lng;
    state.latitude = lat;

    state.barangay = context.find((c) => c.id.includes("neighborhood"))?.text || "";
    state.city = context.find((c) => c.id.includes("place"))?.text || "";
    state.landmark = context.find((c) => c.id.includes("poi"))?.text || "";

    mapModalOpen.value = false;
    pendingAddress.value = null;
}

function rejectAddress() {
    // Keep user’s manual input
    mapModalOpen.value = false;
    pendingAddress.value = null;
}
async function onSubmit(event: FormSubmitEvent<Schema>) {
    toast.add({ title: "Success", description: "The form has been submitted.", color: "success" });
    console.log(event.data);
}
</script>

<template>
    <div class="space-y-5">
        <h1 class="text-2xl font-bold">Create Listing</h1>
        <UForm :schema="schema" :state="state" class="space-y-5" @submit="onSubmit">
            <div class="flex flex-col rounded-lg bg-gray-50 p-4 space-y-4">
                <strong>Basic Info</strong>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <UFormField label="Title" name="title" class="w-full">
                        <UInput v-model="state.title" size="xl" class="w-full" />
                    </UFormField>

                    <UFormField label="Description" name="description" class="w-full">
                        <UInput v-model="state.description" size="xl" class="w-full" />
                    </UFormField>
                    <UFormField label="Availability" name="availability" class="w-full">
                        <USelect
                            v-model="state.availability"
                            :items="availabilityOptions"
                            size="xl"
                            class="w-full"
                        />
                    </UFormField>
                    <UFormField label="Price" name="price" class="w-full">
                        <UInputNumber
                            v-model="state.price"
                            :step="500"
                            :format-options="{
                                style: 'currency',
                                currency: 'PHP',
                                currencyDisplay: 'code',
                                currencySign: 'accounting',
                            }"
                            size="xl"
                            class="w-full"
                        />
                    </UFormField>
                </div>
            </div>

            <div class="flex flex-col rounded-lg bg-gray-50 p-4 space-y-4">
                <strong>Property Details</strong>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <UFormField label="Max Occupants" name="occupants" class="w-full">
                        <UInputNumber v-model="state.occupants" size="xl" class="w-full" />
                    </UFormField>
                    <UFormField label="Bedrooms" name="bedrooms" class="w-full">
                        <UInputNumber v-model="state.bedrooms" size="xl" class="w-full" />
                    </UFormField>
                    <UFormField label="Bathrooms" name="bathrooms" class="w-full">
                        <UInputNumber v-model="state.bathrooms" size="xl" class="w-full" />
                    </UFormField>
                    <UFormField
                        label="Advance Rent (in Months)"
                        name="month_advance"
                        class="w-full"
                    >
                        <UInputNumber v-model="state.month_advance" size="xl" class="w-full" />
                    </UFormField>
                    <UFormField
                        label="Advance Deposit (in Months)"
                        name="month_deposit"
                        class="w-full"
                    >
                        <UInputNumber v-model="state.month_deposit" size="xl" class="w-full" />
                    </UFormField>

                    <UFormField label="Kitchen Type" name="kitchen_type" class="w-full">
                        <USelect
                            v-model="state.kitchen_type"
                            :items="typeOptions"
                            size="xl"
                            class="w-full"
                        />
                    </UFormField>

                    <UFormField label="Bathroom Type" name="bathroom_type" class="w-full">
                        <USelect
                            v-model="state.bathroom_type"
                            :items="typeOptions"
                            size="xl"
                            class="w-full"
                        />
                    </UFormField>

                    <UFormField label="Amenities" name="amenities" class="w-full">
                        <USelectMenu
                            v-model="state.amenities"
                            multiple
                            :items="amenitiesOptions"
                            size="xl"
                            class="w-full"
                        />
                    </UFormField>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <UCheckbox color="primary" variant="card" label="Own Electric Meter" />

                    <UCheckbox color="primary" variant="card" label="Own Water Meter" />

                    <UCheckbox color="primary" variant="card" label="Internet Ready" />

                    <UCheckbox color="primary" variant="card" label="Cable Tv" />
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div class="flex flex-col rounded-lg bg-gray-50 p-4 space-y-4">
                    <div class="flex justify-between items-center">
                        <div class="flex flex-col">
                            <strong>Nearby Places</strong>
                            <small
                                >List important nearby places (e.g., schools, markets, transport)
                                <br />
                                to make your property more attractive to seekers.</small
                            >
                        </div>
                        <UButton
                            label="Add Nearby Place"
                            icon="i-lucide-plus"
                            color="secondary"
                            variant="soft"
                            class="w-52 justify-center"
                            @click="nearbyPlacesModalOpen = true"
                        />
                    </div>

                    <!-- Table -->
                    <UTable :data="nearbyPlacesList" :columns="columns" class="flex-1" />

                    <!-- Modal -->
                    <UModal
                        v-model:open="nearbyPlacesModalOpen"
                        title="Nearby Place"
                        description="List important places around the property (e.g. malls, schools, hospitals)."
                        :ui="{ footer: 'justify-end' }"
                    >
                        <template #body>
                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <UFormField label="Place Name" name="place_name" class="w-full">
                                    <UInput
                                        v-model="stateNearbyPlaces.place_name"
                                        size="xl"
                                        class="w-full capitalize"
                                        tabindex="1"
                                    />
                                </UFormField>
                                <UFormField label="Place Type" name="place_type" class="w-full">
                                    <USelect
                                        v-model="stateNearbyPlaces.place_type"
                                        :items="placeType"
                                        size="xl"
                                        class="w-full"
                                        tabindex="2"
                                    />
                                </UFormField>
                                <UFormField
                                    label="Estimated Distance (km)"
                                    name="distance"
                                    class="w-full"
                                >
                                    <UInputNumber
                                        v-model="stateNearbyPlaces.distance"
                                        :step="0.3"
                                        size="xl"
                                        class="w-full"
                                        tabindex="3"
                                    />
                                </UFormField>
                                <UFormField
                                    label="Estimated Duration (min)"
                                    name="duration"
                                    class="w-full"
                                >
                                    <UInputNumber
                                        v-model="stateNearbyPlaces.duration"
                                        :step="0.5"
                                        size="xl"
                                        class="w-full"
                                        tabindex="4"
                                    />
                                </UFormField>
                                <UFormField label="Mode" name="mode" class="col-start-1 col-end-3">
                                    <USelect
                                        v-model="stateNearbyPlaces.mode"
                                        :items="mode"
                                        size="xl"
                                        class="w-full"
                                        tabindex="5"
                                    />
                                </UFormField>
                            </div>
                        </template>

                        <template #footer="{ close }">
                            <UButton
                                label="Cancel"
                                color="neutral"
                                variant="outline"
                                tabindex="7"
                                @click="close"
                            />
                            <UButton
                                label="Save"
                                color="primary"
                                tabindex="6"
                                @click="handleNearbyPlaceSubmit"
                            />
                        </template>
                    </UModal>
                </div>
                <div class="flex flex-col rounded-lg bg-gray-50 p-4 space-y-4">
                    <div class="flex flex-col">
                        <strong>Property Images</strong>
                        <small
                            >Upload at least 4 images. The first one will be used as the primary
                            display image.</small
                        >
                    </div>

                    <UFileUpload
                        layout="grid"
                        multiple
                        label="Drop your images here"
                        description="PNG, JPG or GIF (max. 2MB)"
                        class="w-full"
                        :ui="{
                            base: 'h-32',
                        }"
                        size="sm"
                    />
                </div>
            </div>

            <div class="flex flex-col rounded-lg bg-gray-50 p-4 space-y-4">
                <strong>Property Address</strong>
                <UButton
                    label="Show Map"
                    icon="i-lucide-plus"
                    color="secondary"
                    variant="soft"
                    class="w-52 justify-center"
                    @click="mapModalOpen = true"
                />
                <UModal v-model:open="mapModalOpen" title="Did you mean?">
                    <template #body>
                        <div class="p-4 space-y-4">
                            <p class="text-blue-500 underline cursor-pointer">
                                {{ pendingAddress?.place_name }}
                            </p>

                            <div id="mini-map" class="w-full h-48 rounded-md"></div>

                            <div class="flex gap-2 mt-4">
                                <UButton color="primary" @click="confirmAddress"
                                    >Yes, confirm</UButton
                                >
                                <UButton color="neutral" variant="outline" @click="rejectAddress">
                                    No, use the address I provided
                                </UButton>
                            </div>
                        </div>
                    </template>
                    <template #footer="{ close }">
                        <UButton
                            label="Cancel"
                            color="neutral"
                            variant="outline"
                            tabindex="7"
                            @click="close"
                        />
                        <UButton
                            label="Save"
                            color="primary"
                            tabindex="6"
                            @click="handleNearbyPlaceSubmit"
                        />
                    </template>
                </UModal>

                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <UFormField label="Title" name="title" class="w-full">
                        <UInput v-model="state.title" size="xl" class="w-full" />
                    </UFormField>

                    <UFormField label="Description" name="description" class="w-full">
                        <UInput v-model="state.description" size="xl" class="w-full" />
                    </UFormField>
                    <UFormField label="Availability" name="availability" class="w-full">
                        <USelect
                            v-model="state.availability"
                            :items="availabilityOptions"
                            size="xl"
                            class="w-full"
                        />
                    </UFormField>
                    <UFormField label="Price" name="price" class="w-full">
                        <UInputNumber
                            v-model="state.price"
                            :step="500"
                            :format-options="{
                                style: 'currency',
                                currency: 'PHP',
                                currencyDisplay: 'code',
                                currencySign: 'accounting',
                            }"
                            size="xl"
                            class="w-full"
                        />
                    </UFormField>
                </div>
            </div>

            <UButton type="submit"> Submit </UButton>
        </UForm>
    </div>
</template>
