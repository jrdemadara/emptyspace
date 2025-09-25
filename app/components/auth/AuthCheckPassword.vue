<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import { useAuth } from "@/stores/auth";
import { useCheckPassword } from "~/composables/auth/useCheckPassword";
const router = useRouter();
const auth = useAuth();

const schema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters").max(64),
});
type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
    email: auth.email,
    password: undefined,
});

const toast = useToast();

async function onSubmit(event: FormSubmitEvent<Schema>) {
    const { data, error, refresh } = useCheckPassword(event.data.email, event.data.password);
    await refresh();

    if (error.value) {
        toast.add({
            title: "Login Failed",
            description: error.value.message || "Invalid credentials",
            color: "error",
        });
        return;
    }

    if (data.value?.token && data.value.user) {
        toast.add({
            title: "Login Successful",
            description: `Welcome back, ${data.value.user?.first_name}`,
            color: "success",
        });
        auth.setAuth({
            token: data.value.token,
            user: {
                ...data.value.user,
                guest: false,
                photo: data.value.user.photo ?? null,
            },
        });
        router.push({ name: "dashboard" });
    }
}
</script>

<template>
    <div class="flex flex-col space-y-2">
        <div class="flex items-center justify-between">
            <p class="flex items-center gap-2">
                <span class="font-medium">Email:</span>
                <span>{{ auth.email }}</span>
            </p>
            <UButton
                type="button"
                variant="ghost"
                color="neutral"
                class="text-blue-500 underline hover:text-blue-600"
                @click="auth.setStep('check')"
            >
                Change
            </UButton>
        </div>

        <UForm
            :schema="schema"
            :state="state"
            class="flex flex-col w-full space-y-4"
            @submit="onSubmit"
        >
            <UFormField name="password" size="xl">
                <UInput
                    v-model="state.password"
                    color="neutral"
                    placeholder="Password"
                    class="w-full"
                    type="password"
                />
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
