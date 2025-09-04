<template>
    <div class="flex min-h-screen bg-white">
        <aside class="w-64 bg-slate-800 text-white">
            <HostSidebar />
        </aside>
        <main class="flex-grow p-6">
            <slot />
        </main>
    </div>
</template>
