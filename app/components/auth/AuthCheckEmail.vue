<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import { useAuth } from "@/stores/auth";
import { useCheckEmail } from "~/composables/auth/useCheckEmail";

const auth = useAuth();
const toast = useToast();

// ✅ Validation schema
const schema = z.object({
    email: z.string().email("Invalid email"),
});
type Schema = z.output<typeof schema>;

// ✅ Form state
const state = reactive<Partial<Schema>>({
    email: undefined,
});

// ✅ Initialize composable once (not inside onSubmit)
const { result, error, refresh } = useCheckEmail();

async function onSubmit() {
    await refresh(state.email!); // pass plain string

    if (error.value) {
        toast.add({
            title: "Error",
            description: error.value.message || "Something went wrong!",
            color: "error",
        });
        return;
    }

    if (result.value?.exists === false) {
        toast.add({
            title: "New User",
            description: "Proceed to registration",
            color: "neutral",
        });
        auth.setEmail(state.email!);
        auth.setStep("register");
    } else if (result.value?.exists === true) {
        toast.add({
            title: "Email Found",
            description: "Proceed to login",
            color: "success",
        });
        auth.setEmail(state.email!);
        auth.setStep("login");
    } else {
        toast.add({
            title: "Error",
            description: result.value?.message || "Unexpected response",
            color: "error",
        });
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
