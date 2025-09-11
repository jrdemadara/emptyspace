<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import { useCheckEmail } from "~/composables/auth/useCheckEmail";

const schema = z.object({
    email: z.string().email("Invalid email"),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
    email: undefined,
});

const toast = useToast();

// Lazy-load composable when needed
let response = ref(null);
let loading = ref(false);
let error = ref(null);

async function onSubmit(event: FormSubmitEvent<Schema>) {
    const { result, loading, error: checkError } = useCheckEmail(event.data.email);

    response.value = result.value;
    loading.value = pending.value;
    error.value = checkError.value;

    if (error.value) {
        toast.add({ title: "Error", description: "Failed to check email", color: "red" });
    } else if (response.value?.exists) {
        toast.add({ title: "Email Found", description: "Proceed to login", color: "green" });
        // show login component
    } else {
        toast.add({ title: "New User", description: "Proceed to registration", color: "amber" });
        // show register component
    }
}

definePageMeta({
    layout: false,
});
</script>

<template>
    <div>
        <UForm
            :schema="schema"
            :state="state"
            class="flex flex-col w-full space-y-4"
            @submit="onSubmit"
        >
            <UFormField name="email" size="xl">
                <UInput v-model="state.email" color="neutral" placeholder="Email" class="w-full" />
            </UFormField>

            <UButton
                :loading="false"
                loading-icon="lucide:loader"
                type="submit"
                size="xl"
                class="bg-amber-500 hover:bg-amber-600"
            >
                <span class="w-full"> Continue </span>
            </UButton>
        </UForm>
    </div>
</template>
