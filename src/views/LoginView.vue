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
    const redirect =
      typeof route.query.redirect === 'string' ? route.query.redirect : '/games'
    await router.replace(redirect)
  } catch (err) {
    localError.value = err instanceof Error ? err.message : 'Unable to sign in.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <main class="login">
    <aside class="login__brand" aria-hidden="true">
      <RouterLink class="login__brand-link" :to="{ name: 'home' }">Backlog Shelf</RouterLink>
      <p class="login__brand-tag">Your games. Your pace. One shelf.</p>
    </aside>

    <section class="login__panel">
      <RouterLink class="login__back" :to="{ name: 'home' }">← Back to home</RouterLink>

      <div class="login__header">
        <h1 class="login__title">Log in</h1>
        <p class="login__lede">Sign in to open your personal game backlog.</p>
      </div>

      <form class="login__form" @submit.prevent="onSubmit">
        <label class="login__field">
          <span>Email</span>
          <input
            v-model="email"
            type="email"
            required
            autocomplete="email"
            placeholder="you@example.com"
          />
        </label>

        <label class="login__field">
          <span>Password</span>
          <input
            v-model="password"
            type="password"
            required
            minlength="6"
            autocomplete="current-password"
            placeholder="••••••••"
          />
        </label>

        <p v-if="localError" class="login__error">{{ localError }}</p>

        <button class="login__submit" type="submit" :disabled="submitting">
          {{ submitting ? 'Signing in…' : 'Log in' }}
        </button>
      </form>

      <p class="login__footer">
        No account yet?
        <RouterLink :to="{ name: 'register' }">Create one</RouterLink>
      </p>
    </section>
  </main>
</template>

<style scoped>
.login {
  min-height: 100vh;
  display: grid;
}

@media (min-width: 900px) {
  .login {
    grid-template-columns: minmax(0, 1.05fr) minmax(22rem, 28rem);
  }
}

.login__brand {
  display: none;
  position: relative;
  padding: 2.5rem;
  background:
    linear-gradient(160deg, color-mix(in oklab, var(--color-accent) 18%, transparent), transparent 45%),
    linear-gradient(180deg, #142421, #0d1614 70%);
  border-right: 1px solid var(--color-line);
  overflow: hidden;
}

.login__brand::after {
  content: '';
  position: absolute;
  inset: auto -10% -20% 20%;
  height: 70%;
  background: radial-gradient(circle, color-mix(in oklab, var(--color-accent) 22%, transparent), transparent 65%);
  filter: blur(10px);
  animation: brand-glow 5s ease-in-out infinite;
}

@media (min-width: 900px) {
  .login__brand {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }
}

.login__brand-link {
  position: relative;
  z-index: 1;
  font-family: var(--font-display);
  font-size: clamp(2.8rem, 5vw, 4.5rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 0.95;
  color: var(--color-foam);
  text-decoration: none;
  max-width: 10ch;
}

.login__brand-tag {
  position: relative;
  z-index: 1;
  margin: 1.25rem 0 0;
  max-width: 18rem;
  color: var(--color-mist);
  font-size: 1.05rem;
  line-height: 1.5;
}

.login__panel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem 1.5rem 3rem;
  animation: panel-in 500ms ease both;
}

@media (min-width: 900px) {
  .login__panel {
    padding: 2.5rem 2.75rem;
  }
}

.login__back {
  width: fit-content;
  margin-bottom: 2rem;
  color: var(--color-mist);
  text-decoration: none;
  font-size: 0.9rem;
}

.login__back:hover {
  color: var(--color-foam);
}

.login__header {
  margin-bottom: 1.5rem;
}

.login__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--color-foam);
}

.login__lede {
  margin: 0.55rem 0 0;
  color: var(--color-mist);
  font-size: 0.95rem;
}

.login__form {
  display: grid;
  gap: 1rem;
}

.login__field {
  display: grid;
  gap: 0.45rem;
}

.login__field span {
  color: var(--color-mist);
  font-size: 0.9rem;
}

.login__field input {
  width: 100%;
  border: 1px solid var(--color-line);
  border-radius: 0.7rem;
  background: color-mix(in oklab, var(--color-ink) 75%, transparent);
  color: var(--color-foam);
  padding: 0.75rem 0.9rem;
  outline: none;
}

.login__field input:focus {
  border-color: color-mix(in oklab, var(--color-accent) 55%, var(--color-line));
  box-shadow: 0 0 0 3px color-mix(in oklab, var(--color-accent) 22%, transparent);
}

.login__error {
  margin: 0;
  border: 1px solid color-mix(in oklab, var(--color-danger) 45%, transparent);
  background: color-mix(in oklab, var(--color-danger) 12%, transparent);
  color: var(--color-danger);
  border-radius: 0.7rem;
  padding: 0.7rem 0.85rem;
  font-size: 0.9rem;
}

.login__submit {
  margin-top: 0.25rem;
  border: 0;
  border-radius: 0.7rem;
  background: var(--color-accent);
  color: var(--color-ink);
  font-weight: 600;
  padding: 0.8rem 1rem;
  cursor: pointer;
  transition:
    background-color 160ms ease,
    color 160ms ease,
    transform 160ms ease;
}

.login__submit:hover:not(:disabled) {
  background: var(--color-accent-dim);
  color: var(--color-foam);
  transform: translateY(-1px);
}

.login__submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login__footer {
  margin: 1.5rem 0 0;
  color: var(--color-mist);
  font-size: 0.92rem;
}

.login__footer a {
  color: var(--color-accent);
  text-decoration: none;
}

.login__footer a:hover {
  text-decoration: underline;
}

@keyframes panel-in {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes brand-glow {
  0%,
  100% {
    opacity: 0.55;
  }
  50% {
    opacity: 0.95;
  }
}

@media (prefers-reduced-motion: reduce) {
  .login__panel,
  .login__brand::after {
    animation: none;
  }
}
</style>
