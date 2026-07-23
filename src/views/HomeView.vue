<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
</script>

<template>
  <div class="home">
    <header class="home-nav">
      <RouterLink class="home-nav__brand" :to="{ name: 'home' }">Backlog Shelf</RouterLink>
      <nav class="home-nav__links">
        <template v-if="auth.isAuthenticated">
          <RouterLink class="home-nav__ghost" :to="{ name: 'games' }">Open list</RouterLink>
        </template>
        <template v-else>
          <RouterLink class="home-nav__ghost" :to="{ name: 'login' }">Log in</RouterLink>
          <RouterLink class="home-nav__cta" :to="{ name: 'register' }">Get started</RouterLink>
        </template>
      </nav>
    </header>

    <section class="home-hero" aria-labelledby="home-headline">
      <div class="home-hero__copy">
        <p class="home-hero__brand">Backlog Shelf</p>
        <h1 id="home-headline" class="home-hero__title">
          Keep every game you mean to play in one place.
        </h1>
        <p class="home-hero__lede">
          Track start dates, platforms, release dates, and how far you’ve gotten — then pick up where you left off.
        </p>
        <div class="home-hero__actions">
          <RouterLink
            v-if="auth.isAuthenticated"
            class="home-hero__primary"
            :to="{ name: 'games' }"
          >
            Go to your list
          </RouterLink>
          <template v-else>
            <RouterLink class="home-hero__primary" :to="{ name: 'register' }">
              Create free account
            </RouterLink>
            <RouterLink class="home-hero__secondary" :to="{ name: 'login' }">
              Log in
            </RouterLink>
          </template>
        </div>
      </div>

      <div class="home-hero__stage" aria-hidden="true">
        <div class="home-shelf">
          <div class="home-shelf__glow" />
          <ul class="home-shelf__spines">
            <li style="--i: 0">Hades II</li>
            <li style="--i: 1">Expedition 33</li>
            <li style="--i: 2">Silksong</li>
            <li style="--i: 3">Death Stranding 2</li>
            <li style="--i: 4">Metaphor</li>
            <li style="--i: 5">Blue Prince</li>
            <li style="--i: 6">Doom: The Dark Ages</li>
          </ul>
          <div class="home-shelf__ledge" />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  min-height: 100vh;
  overflow: clip;
}

.home-nav {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  max-width: 72rem;
  margin: 0 auto;
}

.home-nav__brand {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 1.05rem;
  letter-spacing: 0.04em;
  color: var(--color-foam);
  text-decoration: none;
}

.home-nav__links {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.home-nav__ghost,
.home-nav__cta,
.home-hero__primary,
.home-hero__secondary {
  text-decoration: none;
  border-radius: 0.65rem;
  font-weight: 500;
  transition:
    transform 180ms ease,
    background-color 180ms ease,
    border-color 180ms ease,
    color 180ms ease;
}

.home-nav__ghost {
  color: var(--color-mist);
  padding: 0.55rem 0.85rem;
}

.home-nav__ghost:hover {
  color: var(--color-foam);
}

.home-nav__cta {
  background: var(--color-accent);
  color: var(--color-ink);
  padding: 0.55rem 0.95rem;
}

.home-nav__cta:hover {
  background: var(--color-accent-dim);
  color: var(--color-foam);
}

.home-hero {
  position: relative;
  display: grid;
  min-height: calc(100vh - 4.5rem);
  align-items: center;
  gap: 2rem;
  max-width: 72rem;
  margin: 0 auto;
  padding: 1rem 1.5rem 3rem;
}

@media (min-width: 900px) {
  .home-hero {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
    gap: 3rem;
    padding-top: 0;
  }
}

.home-hero__copy {
  position: relative;
  z-index: 1;
  max-width: 34rem;
  animation: rise-in 700ms ease both;
}

.home-hero__brand {
  margin: 0 0 0.85rem;
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 3.4rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1;
  color: var(--color-accent);
}

.home-hero__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.55rem, 3.4vw, 2.35rem);
  font-weight: 600;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--color-foam);
}

.home-hero__lede {
  margin: 1rem 0 0;
  max-width: 30rem;
  color: var(--color-mist);
  font-size: 1.05rem;
  line-height: 1.55;
}

.home-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.75rem;
}

.home-hero__primary {
  background: var(--color-accent);
  color: var(--color-ink);
  padding: 0.8rem 1.2rem;
}

.home-hero__primary:hover {
  background: var(--color-accent-dim);
  color: var(--color-foam);
  transform: translateY(-1px);
}

.home-hero__secondary {
  border: 1px solid var(--color-line);
  color: var(--color-foam);
  padding: 0.8rem 1.2rem;
}

.home-hero__secondary:hover {
  border-color: color-mix(in oklab, var(--color-foam) 35%, var(--color-line));
  transform: translateY(-1px);
}

.home-hero__stage {
  position: relative;
  min-height: 18rem;
  animation: fade-slide 900ms 120ms ease both;
}

@media (min-width: 900px) {
  .home-hero__stage {
    min-height: 28rem;
  }
}

.home-shelf {
  position: absolute;
  inset: 0;
  display: grid;
  align-content: end;
  padding: 1.5rem 0.5rem 2rem;
}

.home-shelf__glow {
  position: absolute;
  inset: 8% 10% auto;
  height: 55%;
  background:
    radial-gradient(ellipse at 50% 40%, color-mix(in oklab, var(--color-accent) 28%, transparent), transparent 70%);
  filter: blur(8px);
  animation: pulse-glow 4.5s ease-in-out infinite;
}

.home-shelf__spines {
  position: relative;
  z-index: 1;
  list-style: none;
  margin: 0;
  padding: 0 0.75rem;
  display: flex;
  align-items: end;
  justify-content: center;
  gap: 0.55rem;
  min-height: 14rem;
}

.home-shelf__spines li {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  display: flex;
  align-items: center;
  justify-content: center;
  width: clamp(2.4rem, 5vw, 3.35rem);
  height: calc(10rem + (var(--i) * 0.55rem));
  border-radius: 0.35rem 0.35rem 0.15rem 0.15rem;
  font-family: var(--font-display);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-foam);
  box-shadow: inset 0 0 0 1px color-mix(in oklab, white 12%, transparent);
  animation: shelf-settle 800ms calc(180ms + var(--i) * 70ms) ease both;
}

.home-shelf__spines li:nth-child(odd) {
  background: linear-gradient(180deg, #25463d, #163029);
}

.home-shelf__spines li:nth-child(even) {
  background: linear-gradient(180deg, #2a3f55, #172533);
}

.home-shelf__spines li:nth-child(3) {
  background: linear-gradient(180deg, #3a2f4d, #21182c);
}

.home-shelf__spines li:nth-child(5) {
  background: linear-gradient(180deg, #4a3a28, #2a2016);
}

.home-shelf__ledge {
  position: relative;
  z-index: 1;
  height: 0.85rem;
  margin: 0 0.25rem;
  border-radius: 0.2rem;
  background: linear-gradient(180deg, #3d5a52, #243832 55%, #1a2824);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.45);
}

@keyframes rise-in {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-slide {
  from {
    opacity: 0;
    transform: translateX(24px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes shelf-settle {
  from {
    opacity: 0;
    transform: rotate(180deg) translateY(24px);
  }
  to {
    opacity: 1;
    transform: rotate(180deg) translateY(0);
  }
}

@keyframes pulse-glow {
  0%,
  100% {
    opacity: 0.55;
    transform: scale(0.98);
  }
  50% {
    opacity: 0.9;
    transform: scale(1.03);
  }
}

@media (prefers-reduced-motion: reduce) {
  .home-hero__copy,
  .home-hero__stage,
  .home-shelf__spines li,
  .home-shelf__glow {
    animation: none;
  }
}
</style>
