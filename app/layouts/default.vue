<template>
  <div class="flex flex-col min-h-screen">
    <!-- Header -->
    <AppHeader />

    <!-- Main content -->
    <main class="flex-grow pt-14 bg-slate-50">
      <slot />
    </main>

    <!-- Footer -->
    <AppFooter />
  </div>
</template>
