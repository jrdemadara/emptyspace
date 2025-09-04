<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

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
        <AppLogo logo-class="size-18" text-class="text-3xl text-slate-950" />
        <div
            class="flex flex-col rounded-lg border border-slate-200 p-12 space-y-8 w-1/2 max-w-5xl"
        >
            <div class="flex">
                <UButton
                    icon="lucide:arrow-left"
                    color="neutral"
                    variant="ghost"
                    @click="$router.push('/')"
                >
                    Cancel
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
                    <UForm
                        :schema="schema"
                        :state="state"
                        class="flex flex-col w-full space-y-4"
                        @submit="onSubmit"
                    >
                        <UFormField name="email" size="xl">
                            <UInput
                                v-model="state.email"
                                color="neutral"
                                placeholder="Email"
                                class="w-full"
                            />
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
                    <div class="flex items-center">
                        <div class="flex-grow h-px bg-slate-300"></div>
                        <span class="px-3 text-sm text-slate-500">OR</span>
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
                        <UButton
                            color="neutral"
                            variant="outline"
                            size="xl"
                            class="relative justify-center"
                        >
                            <Icon name="ic:baseline-apple" class="absolute left-4 size-5" />
                            Apple
                        </UButton>
                        <UCheckbox size="xl" color="warning" label="Keep me signed in" />
                        <small
                            >By continuing, you’ve read and agree to our
                            <span class="underline text-blue-600">Terms and Conditions</span>
                            and
                            <span class="underline text-blue-600">Privacy Policy</span>.</small
                        >
                    </div>
                </div>

                <div class="h-full w-0.5 bg-slate-200"></div>
                <div class="flex flex-col w-full">right side</div>
            </div>
        </div>
    </div>
</template>
