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
    <div class="flex items-center space-x-2">
        <!-- The logo icon -->
        <div class="flex items-center justify-center" :class="logoClass">
            <img src="../assets/img/logonobg.png" alt="" />
        </div>

        <!-- The logo text -->
        <h1 class="font-semibold tracking-tight" :class="textClass">Findspace</h1>
    </div>
</template>
