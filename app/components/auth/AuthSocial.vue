<script setup lang="ts"></script>

<template>
    <div class="flex flex-col space-y-3">
        <UButton color="neutral" variant="outline" size="xl" class="relative justify-center">
            <Icon name="flat-color-icons:google" class="absolute left-4 size-5" />
            Google
        </UButton>
        <UButton color="neutral" variant="outline" size="xl" class="relative justify-center">
            <Icon name="devicon:facebook" class="absolute left-4 size-5" />
            Facebook
        </UButton>

        <UCheckbox size="xl" color="warning" label="Keep me signed in" />
    </div>
</template>
