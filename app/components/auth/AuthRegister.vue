<script setup lang="ts">
import { z } from "zod";
import { vMaska } from "maska/vue";
import { useRegister } from "~/composables/auth/useRegister";
const { result, error, refresh } = useRegister();
const auth = useAuth();
const toast = useToast();
const showPassword = ref(false);

const schema = z.object({
    first_name: z
        .string("Invalid first name")
        .min(2, "First name must be at least 2 characters")
        .max(100, "First name must be at most 100 characters"),
    last_name: z
        .string("Invalid last name")
        .min(2, "Last name must be at least 2 characters")
        .max(100, "Last name must be at most 100 characters"),
    display_name: z
        .string("Invalid display name")
        .min(2, "Display name must be at least 2 characters")
        .max(100, "Display name must be at most 100 characters"),
    email: z.email("Invalid email"),
    phone: z
        .string()
        .min(10, "Phone must be at least 10 digits")
        .max(15, "Phone must be at most 15 digits"),
    password: z.string().min(6, "Password must be at least 6 characters").max(64),
    role: z.string(),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
    first_name: undefined,
    last_name: undefined,
    display_name: undefined,
    email: auth.email,
    phone: undefined,
    password: undefined,
    role: auth.isHost ? "host" : "seeker",
});

function checkStrength(str: string) {
    const requirements = [
        { regex: /.{8,}/, text: "At least 8 characters" },
        { regex: /\d/, text: "At least 1 number" },
        { regex: /[a-z]/, text: "At least 1 lowercase letter" },
        { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
    ];

    return requirements.map((req) => ({ met: req.regex.test(str), text: req.text }));
}

const strength = computed(() => checkStrength(state.password ?? ""));
const score = computed(() => strength.value.filter((req) => req.met).length);

const color = computed(() => {
    if (score.value === 0) return "neutral";
    if (score.value <= 1) return "error";
    if (score.value <= 2) return "warning";
    if (score.value === 3) return "warning";
    return "success";
});

const text = computed(() => {
    if (score.value === 0) return "Enter a password";
    if (score.value <= 2) return "Weak password";
    if (score.value === 3) return "Medium password";
    return "Strong password";
});

async function onSubmit() {
    console.log("Submitting form");
    const payload = {
        first_name: state.first_name,
        last_name: state.last_name,
        display_name: state.display_name,
        email: state.email,
        phone: state.phone,
        password: state.password,
        role: state.role,
    };

    await refresh(payload);

    if (error.value) {
        toast.add({
            title: "Registration Failed",
            description: error.value.message || "Please check your inputs",
            color: "error",
        });
        return;
    }

    if (result.value?.token && result.value.user) {
        toast.add({
            title: "Registration Successful",
            description: `Welcome, ${result.value.user.first_name}`,
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
        // router.push({ name: "dashboard" });
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
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <UFormField name="first_name" size="xl">
                    <UInput
                        v-model="state.first_name"
                        color="neutral"
                        placeholder="First Name"
                        class="w-full"
                    />
                </UFormField>
                <UFormField name="last_name" size="xl">
                    <UInput
                        v-model="state.last_name"
                        color="neutral"
                        placeholder="Last Name"
                        class="w-full"
                    />
                </UFormField>
                <UFormField name="display_name" size="xl">
                    <UInput
                        v-model="state.display_name"
                        color="neutral"
                        placeholder="Display Name"
                        class="w-full"
                    />
                </UFormField>
                <UFormField name="phone" size="xl">
                    <UFieldGroup>
                        <UInput
                            v-model="state.phone"
                            v-maska="'### ### ####'"
                            :ui="{
                                base: 'pl-14.5',
                                leading: 'pointer-events-none',
                            }"
                        >
                            <template #leading>
                                <p class="text-sm text-muted">+63</p>
                            </template>
                        </UInput>
                    </UFieldGroup>
                </UFormField>
            </div>

            <div class="space-y-2">
                <UFormField size="xl">
                    <UInput
                        v-model="state.password"
                        placeholder="Password"
                        :color="color"
                        :type="showPassword ? 'text' : 'password'"
                        :aria-invalid="score < 4"
                        aria-describedby="password-strength"
                        :ui="{ trailing: 'pe-1' }"
                        class="w-full"
                    >
                        <template #trailing>
                            <UButton
                                color="neutral"
                                variant="link"
                                size="xl"
                                :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                                :aria-label="showPassword ? 'Hide password' : 'Show password'"
                                :aria-pressed="showPassword"
                                aria-controls="password"
                                @click="showPassword = !showPassword"
                            />
                        </template>
                    </UInput>
                </UFormField>

                <UProgress
                    :color="color"
                    :indicator="text"
                    :model-value="score"
                    :max="4"
                    size="sm"
                />

                <p id="password-strength" class="text-sm font-medium">{{ text }}. Must contain:</p>

                <ul class="space-y-1" aria-label="Password requirements">
                    <li
                        v-for="(req, index) in strength"
                        :key="index"
                        class="flex items-center gap-0.5"
                        :class="req.met ? 'text-success' : 'text-muted'"
                    >
                        <UIcon
                            :name="req.met ? 'i-lucide-circle-check' : 'i-lucide-circle-x'"
                            class="size-4 shrink-0"
                        />

                        <span class="text-xs font-light">
                            {{ req.text }}
                            <span class="sr-only">
                                {{ req.met ? " - Requirement met" : " - Requirement not met" }}
                            </span>
                        </span>
                    </li>
                </ul>
            </div>

            <UButton
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
