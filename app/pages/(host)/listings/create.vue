<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent, SelectItem, TableColumn } from "@nuxt/ui";
import type { Row } from "@tanstack/vue-table";
import mapboxgl from "mapbox-gl";

const colorMode = useColorMode();
const colorModeClass = computed(() => (colorMode.value === "dark" ? "dark" : ""));

definePageMeta({
    layout: "host",
    middleware: ["auth"],
});

const toast = useToast();

const availability = ["For Sale", "For Lease", "For Rent"];
const type = ["Private", "Shared", "None"];
const status = ["Draft", "Available"];

const mode = ["Walk", "Drive", "Bike", "Transit"];
const placeType = ["Mall", "Pharmacy", "School", "Hospital", "Transport", "Other"];
const checkBoxOptions = ref(["Publish", "Draft"]);

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

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const MIN_DIMENSIONS = { width: 200, height: 200 };
const MAX_DIMENSIONS = { width: 4096, height: 4096 };
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

const validateDimensions = (file: File) =>
    new Promise<boolean>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const meets =
                    img.width >= MIN_DIMENSIONS.width &&
                    img.height >= MIN_DIMENSIONS.height &&
                    img.width <= MAX_DIMENSIONS.width &&
                    img.height <= MAX_DIMENSIONS.height;
                resolve(meets);
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    });

const schema = z.object({
    title: z
        .string()
        .min(6, "Title must be at least 6 characters")
        .max(100, "Title must be at most 100 characters"),
    description: z.string().optional(),
    availability: z.enum(availability),
    price: z.number().min(1, "Price must be greater than 0"),

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
    ac_ready: z.boolean().default(false),
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
    country: z
        .string("Invalid country")
        .min(3, "Country must be at least 3 characters")
        .max(100, "Country must be at most 100 characters"),
    longitude: z
        .number()
        .min(-180, "Longitude must be between -180 and 180")
        .max(180, "Longitude must be between -180 and 180"),
    latitude: z
        .number()
        .min(-90, "Latitude must be between -90 and 90")
        .max(90, "Latitude must be between -90 and 90"),

    amenities: z.array(z.string()).optional(),
    nearby_places: z
        .array(
            z.object({
                place_name: z.string(),
                place_type: z.string(),
                distance: z.number(),
                duration: z.number(),
                mode: z.string(),
            }),
        )
        .min(1, "At least 1 nearby place is required"),
    images: z
        .array(
            z
                .instanceof(File, { message: "Please select an image file." })
                .refine((file) => file.size <= MAX_FILE_SIZE, {
                    message: `Each image must be smaller than ${formatBytes(MAX_FILE_SIZE)}.`,
                })
                .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
                    message: "Images must be JPEG, PNG, or WebP.",
                })
                .refine((file) => validateDimensions(file), {
                    message: `Images must be between ${MIN_DIMENSIONS.width}x${MIN_DIMENSIONS.height}
                      and ${MAX_DIMENSIONS.width}x${MAX_DIMENSIONS.height} pixels.`,
                }),
        )
        .min(4, { message: "Please upload at least 4 images." })
        .max(4, { message: "You can upload a maximum of 4 images." }),
    status: z.enum(status),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
    title: "",
    description: "",
    availability: undefined,
    price: 0,

    occupants: 0,
    bedrooms: 0,
    bathrooms: 0,
    month_advance: 0,
    month_deposit: 0,
    own_electric_meter: false,
    own_water_meter: false,
    internet_ready: false,
    ac_ready: false,

    kitchen_type: undefined,
    bathroom_type: undefined,

    address: "",
    barangay: "",
    city: "",
    country: "",
    longitude: 0,
    latitude: 0,
    amenities: [],
    nearby_places: [] as NearbyPlace[],
    images: [],
    status: "",
});

const capitalizeWords = (input: string) =>
    input
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");

const nearbyPlaceSchema = z.object({
    place_name: z.string().min(1, "Place name is required").transform(capitalizeWords),
    place_type: z.enum(placeType),
    distance: z.number().min(0),
    duration: z.number().min(0),
    mode: z.enum(mode),
});
type NearbyPlace = z.infer<typeof nearbyPlaceSchema>;

const nearbyPlacesModalOpen = ref(false);
const editIndex = ref<number | null>(null);

const stateNearbyPlaces = reactive<Partial<NearbyPlace>>({
    place_name: undefined,
    place_type: undefined,
    distance: 0,
    duration: 0,
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
                        type: "button",
                        class: "text-blue-600  hover:underline",
                        onClick: () => editPlace(row),
                    },
                    "Edit",
                ),
                h(
                    "button",
                    {
                        type: "button",
                        class: "text-red-600 hover:underline",
                        onClick: () => deletePlace(row),
                    },
                    "Delete",
                ),
            ]),
    },
];

const mapModalOpen = ref(false);
const miniMapRef = ref<HTMLDivElement | null>(null);
const map: Ref<mapboxgl.Map | null> = ref(null);
const marker: Ref<mapboxgl.Marker | null> = ref(null);

interface MapboxFeature {
    id: string;
    place_name: string;
    center: [number, number];
}

interface MapboxResponse {
    type: string;
    query: string[];
    features: MapboxFeature[];
}

const searchQuery = ref("");
const searchResults = ref<MapboxFeature[]>([]);

const isLoading = ref(false);

const pendingAddress = reactive<{
    place_name?: string;
    longitude?: number;
    latitude?: number;
    city?: string;
    barangay?: string;
    street?: string;
}>({});

watch(mapModalOpen, async (val) => {
    if (!val) return;

    await nextTick();
    await new Promise((r) => setTimeout(r, 200)); // wait for animation

    if (!miniMapRef.value) return;

    // Destroy previous map if it exists
    if (map.value) {
        map.value.remove();
        map.value = null;
        marker.value = null;
    }

    mapboxgl.accessToken =
        "pk.eyJ1Ijoiam9obm55cm9nZXJzIiwiYSI6ImNtYW5jNGRlcjBzZjEyaXM0bXRuaXE3eDIifQ.9Sl7B33OcqBAHXUiXGAveA";

    map.value = new mapboxgl.Map({
        container: miniMapRef.value,
        style:
            colorModeClass.value === "dark"
                ? "mapbox://styles/johnnyrogers/cliwri7p3004v01pb56rt8tcv"
                : "mapbox://styles/mapbox/light-v11",
        center: [state.longitude || 124.6787, state.latitude || 6.6884],
        zoom: 14,
    });

    map.value.on("load", () => map.value!.resize());

    map.value.on("dblclick", async (e) => {
        const coords = e.lngLat;

        if (!marker.value) {
            marker.value = new mapboxgl.Marker({ draggable: true })
                .setLngLat(coords)
                .addTo(map.value!);

            marker.value.on("dragend", async () => {
                const lngLat = marker.value!.getLngLat();
                const result = await reverseGeocode(lngLat.lng, lngLat.lat);
                pendingAddress.place_name = result.place_name;
            });
        } else {
            marker.value.setLngLat(coords);
        }

        const result = await reverseGeocode(coords.lng, coords.lat);
        pendingAddress.place_name = result.place_name;
    });
});

async function fetchSuggestions() {
    if (!searchQuery.value.trim()) {
        searchResults.value = [];
        return;
    }
    isLoading.value = true;
    try {
        const res = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
                searchQuery.value,
            )}.json?access_token=pk.eyJ1Ijoiam9obm55cm9nZXJzIiwiYSI6ImNtYW5jNGRlcjBzZjEyaXM0bXRuaXE3eDIifQ.9Sl7B33OcqBAHXUiXGAveA&autocomplete=true&limit=5`,
        );
        const data: MapboxResponse = await res.json();
        searchResults.value = data.features.map((f) => ({
            id: f.id,
            place_name: f.place_name,
            center: f.center,
        }));
    } finally {
        isLoading.value = false;
    }
}

function selectPlace(place: { place_name: string; center: [number, number] }) {
    searchQuery.value = place.place_name;
    searchResults.value = [];

    if (map.value) {
        map.value.flyTo({
            center: place.center,
            zoom: 15,
            essential: true,
        });
    }
}
async function reverseGeocode(lng: number, lat: number) {
    const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`,
    );
    const data = await res.json();

    let country = "";
    let city = "";
    let barangay = "";
    let street = "";
    let place_name = "";

    if (data.features && data.features.length > 0) {
        console.log(data.features);
        data.features.forEach((feature: any) => {
            if (feature.place_type.includes("country")) country = feature.text;
            if (feature.place_type.includes("place")) city = feature.text;
            if (feature.place_type.includes("locality")) barangay = feature.text;
            if (feature.place_type.includes("address")) street = feature.text;
            if (!place_name) place_name = feature.place_name;
        });
    }

    return { country, city, barangay, street, place_name };
}

async function confirmAddress() {
    if (!marker.value) {
        toast.add({
            title: "No address selected",
            description: "Please double-click on the map to choose a location first.",
            color: "warning",
        });
        return;
    }
    const lngLat = marker.value.getLngLat();
    const result = await reverseGeocode(lngLat.lng, lngLat.lat);

    state.longitude = lngLat.lng;
    state.latitude = lngLat.lat;
    state.country = result.country;
    state.city = result.city;
    state.barangay = result.barangay;
    state.address = result.street;
    pendingAddress.place_name = result.place_name;

    toast.add({ title: "Address confirmed", color: "success" });
    mapModalOpen.value = false;

    console.log("Address confirmed:", result);
}

function rejectAddress() {
    mapModalOpen.value = false;
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
    toast.add({ title: "Success", description: "The form has been submitted.", color: "success" });
    console.log(event.data);
}
</script>

<template>
    <div class="space-y-5">
        <div class="space-y-1">
            <h1 class="text-2xl font-bold">Create New Listing</h1>
            <p class="leading-snug">
                Fill in the property details, upload images, and set the exact location. Once saved,
                <br />
                your listing will be ready to share or keep as a draft until you’re ready to
                publish.
            </p>
        </div>

        <UForm :schema="schema" :state="state" class="space-y-5 mb-4" @submit="onSubmit">
            <div
                class="flex flex-col rounded-lg bg-gray-50 dark:bg-gray-950/20 shadow-xs p-4 space-y-4"
            >
                <strong>Basic Info</strong>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <UFormField label="Title" name="title" class="w-full">
                        <UInput v-model="state.title" size="xl" class="w-full" />
                    </UFormField>

                    <UFormField
                        label="Description"
                        name="description"
                        hint="Optional"
                        class="w-full"
                    >
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

            <div
                class="flex flex-col rounded-lg bg-gray-50 dark:bg-gray-950/20 shadow-xs p-4 space-y-4"
            >
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
                        label="Advance Rent"
                        hint="Number of Months"
                        name="month_advance"
                        class="w-full"
                    >
                        <UInputNumber v-model="state.month_advance" size="xl" class="w-full" />
                    </UFormField>
                    <UFormField
                        label="Advance Deposit"
                        hint="Number of Months"
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

                    <UFormField
                        label="Amenities"
                        name="amenities"
                        hint="You can select multiple"
                        class="w-full"
                    >
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
                    <UCheckbox
                        v-model="state.own_electric_meter"
                        color="primary"
                        variant="card"
                        label="Dedicated Electric Meter"
                    />

                    <UCheckbox
                        v-model="state.own_water_meter"
                        color="primary"
                        variant="card"
                        label="Dedicated Water Meter"
                    />

                    <UCheckbox
                        v-model="state.internet_ready"
                        color="primary"
                        variant="card"
                        label="Internet Ready"
                    />

                    <UCheckbox
                        v-model="state.ac_ready"
                        color="primary"
                        variant="card"
                        label="Air Condition Ready"
                    />
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div
                    class="flex flex-col rounded-lg bg-gray-50 dark:bg-gray-950/20 p-4 space-y-4 shadow-xs"
                >
                    <div class="flex justify-between items-start">
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
                            icon="i-lucide-map-pin-plus"
                            color="secondary"
                            variant="soft"
                            @click="nearbyPlacesModalOpen = true"
                        />
                    </div>

                    <!-- Table -->
                    <UFormField name="nearby_places" class="w-full">
                        <UTable :data="nearbyPlacesList" :columns="columns" class="flex-1" />
                    </UFormField>
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
                <div
                    class="flex flex-col rounded-lg bg-gray-50 dark:bg-gray-950/20 p-4 space-y-4 shadow-xs"
                >
                    <strong>Property Images</strong>

                    <UFormField
                        label="Upload at least 4 images"
                        hint="  The first image you selected will be used as the primary display
                    image."
                        name="images"
                        class="w-full"
                    >
                        <UFileUpload
                            v-model="state.images"
                            layout="grid"
                            multiple
                            label="Drop your images here"
                            description="PNG, JPG or GIF (max. 2MB)"
                            size="sm"
                            class="w-full"
                            :interactive="false"
                            :ui="{ base: 'h-32' }"
                        >
                            <template #actions="{ open }">
                                <UButton
                                    label="Select images"
                                    icon="i-lucide-upload"
                                    color="neutral"
                                    variant="outline"
                                    @click="open()"
                                />
                            </template>

                            <template #files-top="{ open, files }">
                                <div
                                    v-if="files?.length"
                                    class="mb-2 flex items-center justify-between"
                                >
                                    <p class="font-bold">Files ({{ files?.length }})</p>

                                    <UButton
                                        v-if="files.length < 4"
                                        icon="i-lucide-plus"
                                        label="Add more"
                                        color="neutral"
                                        variant="outline"
                                        class="-my-2"
                                        @click="open()"
                                    />
                                </div>
                            </template>
                        </UFileUpload>
                    </UFormField>
                </div>
            </div>

            <div
                class="flex flex-col rounded-lg bg-gray-50 dark:bg-gray-950/20 p-4 space-y-4 shadow-xs"
            >
                <div class="flex justify-between items-start">
                    <div class="flex flex-col">
                        <strong>Property Address</strong>
                        <small>Select the exact spot on the map for greater accuracy.</small>
                    </div>

                    <UButton
                        label="Select Location"
                        icon="i-lucide-map"
                        color="secondary"
                        variant="soft"
                        @click="mapModalOpen = true"
                    />
                </div>

                <UModal
                    v-model:open="mapModalOpen"
                    :ui="{ content: 'max-w-3xl w-full h-[650px]' }"
                    title="Pinpoint Property Location"
                >
                    <template #body>
                        <div class="flex flex-col h-96 w-full space-y-2">
                            <strong class="text-blue-500 text-sm cursor-pointer">
                                {{ pendingAddress?.place_name }}
                            </strong>
                            <div class="relative w-full">
                                <UInput
                                    v-model="searchQuery"
                                    placeholder="Search address..."
                                    size="xl"
                                    class="w-full"
                                    :loading="isLoading"
                                    @input="fetchSuggestions"
                                />

                                <div
                                    v-if="searchResults.length > 0"
                                    class="absolute z-50 mt-1 w-full rounded-lg border border-slate-800 bg-gray-50 dark:bg-slate-900 shadow"
                                >
                                    <ul>
                                        <li
                                            v-for="place in searchResults"
                                            :key="place.id"
                                            class="cursor-pointer px-4 py-2 hover:bg-gray-100"
                                            @click="selectPlace(place)"
                                        >
                                            {{ place.place_name }}
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div ref="miniMapRef" class="w-full h-full rounded-b-full"></div>
                        </div>
                    </template>
                    <template #footer="{ close }">
                        <UButton
                            label="No, use the address I provided"
                            color="neutral"
                            variant="outline"
                            tabindex="7"
                            @click="rejectAddress"
                        />
                        <UButton
                            label="Yes, confirm"
                            color="primary"
                            tabindex="6"
                            @click="confirmAddress"
                        />
                    </template>
                </UModal>

                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <UFormField label="Street/Avenue" name="address" class="w-full">
                        <UInput v-model="state.address" readonly size="xl" class="w-full" />
                    </UFormField>

                    <UFormField label="Barangay" name="barangay" class="w-full">
                        <UInput v-model="state.barangay" readonly size="xl" class="w-full" />
                    </UFormField>

                    <UFormField label="City" name="city" class="w-full">
                        <UInput v-model="state.city" readonly size="xl" class="w-full" />
                    </UFormField>
                    <UFormField label="Country" name="country" class="w-full">
                        <UInput v-model="state.country" readonly size="xl" class="w-full" />
                    </UFormField>
                </div>
            </div>

            <div class="flex justify-end items-center space-x-3">
                <URadioGroup
                    v-model="state.status"
                    orientation="horizontal"
                    indicator="end"
                    variant="table"
                    default-value="Publish"
                    :items="checkBoxOptions"
                    size="sm"
                />
                <UButton size="xl" leading-icon="i-lucide-check" type="submit">
                    Save Listing
                </UButton>
            </div>
        </UForm>
    </div>
</template>
