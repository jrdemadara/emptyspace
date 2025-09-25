<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import { useAuth } from "@/stores/auth";
import { useCheckEmail } from "~/composables/auth/useCheckEmail";

const auth = useAuth();

const schema = z.object({
    email: z.string().email("Invalid email"),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
    email: undefined,
});

const toast = useToast();
async function onSubmit(event: FormSubmitEvent<Schema>) {
    const { result, error: checkError, refresh } = useCheckEmail(event.data.email);

    await refresh();

    if (checkError.value) {
        toast.add({
            title: "Error",
            description: checkError.value.message || "Failed to check email",
            color: "error",
        });
    } else if (result.value?.message === "Email exists") {
        toast.add({ title: "Email Found", description: "Proceed to login", color: "success" });
        auth.setEmail(event.data.email);
        auth.setStep("login");
    } else {
        toast.add({ title: "New User", description: "Proceed to registration", color: "neutral" });
        auth.setEmail(event.data.email);
        auth.setStep("register");
    }
}
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
                loading-auto
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
