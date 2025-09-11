<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import AppTermsAgreement from "~/components/AppTermsAgreement.vue";

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
});
</script>
<template>
    <div class="flex w-screen h-screen flex-col items-center justify-center space-y-8">
        <AppLogo logo-class="size-12" text-class="text-3xl text-slate-950" />
        <div
            class="flex flex-col rounded-lg border border-slate-300 p-12 space-y-8 w-1/2 max-w-5xl"
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
                <div class="flex flex-col w-full space-y-5">
                    <AppLoginCheckEmail />
                    <div class="flex items-center">
                        <div class="flex-grow h-px bg-slate-300"></div>
                        <span class="px-3 text-sm text-slate-500">or</span>
                        <div class="flex-grow h-px bg-slate-300"></div>
                    </div>

                    <div class="flex flex-col space-y-3">
                        <UButton
                            color="neutral"
                            variant="outline"
                            size="xl"
                            class="relative justify-center"
                        >
                            <Icon name="flat-color-icons:google" class="absolute left-4 size-5" />
                            Google
                        </UButton>
                        <UButton
                            color="neutral"
                            variant="outline"
                            size="xl"
                            class="relative justify-center"
                        >
                            <Icon name="devicon:facebook" class="absolute left-4 size-5" />
                            Facebook
                        </UButton>

                        <UCheckbox size="xl" color="warning" label="Keep me signed in" />
                        <AppTermsAgreement />
                    </div>
                </div>

                <div class="h-full w-0.5 bg-slate-200"></div>
                <AppLoginAd />
            </div>
        </div>
    </div>
</template>
