<script setup>
defineProps({
    logoClass: {
        type: String,
        default: "size-9",
    },
    textClass: {
        type: String,
        default: "text-2xl text-slate-950",
    },
});
</script>

<template>
    <div class="flex items-center">
        <!-- The logo icon -->
        <div class="flex items-center justify-center" :class="logoClass">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="w-full h-full text-amber-500"
            >
                <path d="M2.5 2.5v19h19V2.5h-19zm4 4h11v11h-11V6.5z" />
            </svg>
        </div>

        <!-- The logo text -->
        <h1 class="font-bold tracking-tight" :class="textClass">Emptyspace</h1>
    </div>
</template>
