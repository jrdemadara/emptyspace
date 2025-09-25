<script setup>
definePageMeta({
    layout: "host",
    middleware: ["auth"],
});
</script>
<template>
    <HostSidebar>
        <NuxtPage />
        <!-- renders index.vue, stats.vue, etc -->
    </HostSidebar>
</template>
