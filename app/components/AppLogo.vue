<script setup>
defineProps({
    logoClass: {
        type: String,
        default: "size-9",
    },
    textClass: {
        type: String,
        default: "text-2xl ",
    },
});
</script>

<template>
    <div class="flex items-center space-x-2">
        <!-- The logo icon -->
        <div class="flex items-center justify-center" :class="logoClass">
            <img src="../assets/img/logonobg.png" alt="logo" />
        </div>

        <!-- The logo text -->
        <h1 class="font-semibold tracking-tight text-gray-900 dark:text-white" :class="textClass">
            Findspace
        </h1>
    </div>
</template>
