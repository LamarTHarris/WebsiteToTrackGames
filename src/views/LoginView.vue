<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const submitting = ref(false)
const localError = ref<string | null>(null)

async function onSubmit() {
  submitting.value = true
  localError.value = null
  try {
    await auth.signIn(email.value.trim(), password.value)
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
    await router.replace(redirect)
  } catch (err) {
    localError.value = err instanceof Error ? err.message : 'Unable to sign in.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <main class="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-10">
    <div class="mb-8 text-center">
      <p class="font-display text-sm tracking-[0.2em] text-accent uppercase">Backlog Shelf</p>
      <h1 class="mt-2 font-display text-3xl font-semibold text-foam">Sign in</h1>
      <p class="mt-2 text-sm text-mist">Access your personal game list.</p>
    </div>

    <form
      class="rounded-2xl border border-line/80 bg-panel/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur"
      @submit.prevent="onSubmit"
    >
      <label class="mb-4 block">
        <span class="mb-1.5 block text-sm text-mist">Email</span>
        <input
          v-model="email"
          type="email"
          required
          autocomplete="email"
          class="w-full rounded-lg border border-line bg-ink/60 px-3 py-2.5 text-foam outline-none ring-accent/40 focus:ring-2"
        />
      </label>

      <label class="mb-5 block">
        <span class="mb-1.5 block text-sm text-mist">Password</span>
        <input
          v-model="password"
          type="password"
          required
          minlength="6"
          autocomplete="current-password"
          class="w-full rounded-lg border border-line bg-ink/60 px-3 py-2.5 text-foam outline-none ring-accent/40 focus:ring-2"
        />
      </label>

      <p v-if="localError" class="mb-4 rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">
        {{ localError }}
      </p>

      <button
        type="submit"
        :disabled="submitting"
        class="w-full rounded-lg bg-accent px-4 py-2.5 font-medium text-ink transition hover:bg-accent-dim hover:text-foam disabled:cursor-not-allowed disabled:opacity-60"
      >
        {{ submitting ? 'Signing in…' : 'Sign in' }}
      </button>
    </form>

    <p class="mt-6 text-center text-sm text-mist">
      No account yet?
      <RouterLink class="text-accent hover:underline" :to="{ name: 'register' }">Create one</RouterLink>
    </p>
  </main>
</template>
