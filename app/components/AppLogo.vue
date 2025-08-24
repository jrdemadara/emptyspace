<script setup>
defineProps({
  color: {
    type: String,
    default: "text-slate-950",
  },
});
</script>

<template>
  <div class="flex items-center">
    <!-- The logo icon -->
    <div class="w-9 h-9 flex items-center justify-center">
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
    <h1 class="text-2xl font-bold tracking-tight" :class="color">Emptyspace</h1>
  </div>
</template>
