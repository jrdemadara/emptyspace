<script setup lang="ts">
import { z } from "zod";
import { useAuth } from "@/stores/auth";
import { useLogin } from "~/composables/auth/useLogin";

const router = useRouter();
const auth = useAuth();
const toast = useToast();

const schema = z.object({
    email: z.email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters").max(64),
});
type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
    email: auth.email,
    password: undefined,
});

const { result, loading, error, refresh } = useLogin(
    computed(() => state.email ?? ""),
    computed(() => state.password ?? ""),
);

async function onSubmit() {
    await refresh();

    if (error.value) {
        toast.add({
            title: "Login Failed",
            description: error.value.message || "Invalid credentials",
            color: "error",
        });
        return;
    }

    if (result.value?.token && result.value.user) {
        toast.add({
            title: "Login Successful",
            description: `Welcome back, ${result.value.user.first_name}`,
            color: "success",
        });

        auth.setAuth({
            token: result.value.token,
            user: {
                ...result.value.user,
                guest: false,
                photo: result.value.user.photo ?? null,
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
                <strong>{{ auth.email }}</strong>
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
                loading
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
