<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
const auth = useAuth();

const schema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Must be at least 8 characters"),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
    email: undefined,
    password: undefined,
});

const toast = useToast();
async function onSubmit(event: FormSubmitEvent<Schema>) {
    toast.add({ title: "Success", description: "The form has been submitted.", color: "success" });
    console.log(event.data);
}
definePageMeta({
    layout: false,
    middleware: ["guest"],
});
</script>
<template>
    <div class="flex w-screen h-screen flex-col items-center justify-center space-y-8">
        <AppLogo logo-class="size-12" text-class="text-3xl" />
        <div
            class="flex flex-col rounded-lg border border-slate-300 p-12 space-y-8 w-2/3 max-w-5xl"
        >
            <div class="flex">
                <UButton
                    icon="lucide:arrow-left"
                    color="neutral"
                    variant="ghost"
                    @click="$router.push('/')"
                >
                    Back
                </UButton>
            </div>
            <div class="flex flex-col justify-center items-center">
                <h2 class="font-bold text-2xl">Sign in or create an account</h2>
                <p class="text-center">
                    Enter your email or mobile number to get started. If you already have an
                    account, we’ll find it for you.
                </p>
            </div>
            <div class="flex w-full justify-between space-x-8">
                <div class="flex flex-col w-full">
                    <div v-if="auth.step == 'check'" class="flex flex-col space-y-8 py-8">
                        <AuthCheckEmail />
                        <div class="flex items-center">
                            <div class="flex-grow h-px bg-slate-300" />
                            <span class="px-3 text-sm text-slate-500">or</span>
                            <div class="flex-grow h-px bg-slate-300" />
                        </div>
                        <AuthSocial />
                    </div>

                    <div v-else-if="auth.step == 'login'" class="py-12">
                        <AuthLogin />
                    </div>

                    <div v-else-if="auth.step == 'register'" class="py-8">
                        <AuthRegister />
                    </div>
                    <AppTermsAgreement />
                </div>

                <div class="h-full w-0.5 bg-slate-200" />
                <AppLoginAd />
            </div>
        </div>
    </div>
</template>
