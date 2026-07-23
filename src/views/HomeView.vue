<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()

const shelves = [
  ['Hades II', 'Expedition 33', 'Silksong','Assassin\'s Creed', 'The Witcher'],
  ['Death Stranding 2', 'Metaphor', 'Blue Prince','Pokemon', 'The Legend of Zelda'],
  ['Doom: The Dark Ages', 'Chrono Trigger', 'Kingdom Come','The Last of Us', 'The Elder Scrolls'],
  ['Clair Obscur', 'The Witcher', 'The Legend of Zelda','The Witcher', 'The Binding of Isaac'],
  ['Kingdom Come', 'The Elder Scrolls', 'The Binding of Isaac','The Legend of Zelda', 'The Last of Us'],
] as const
</script>

<template>
  <div class="home">
    <div class="home-stage" aria-hidden="true">
      <div class="home-stage__glow" />
      <div class="bookshelf">
        <div class="bookshelf__case">
          <div
            v-for="(shelf, shelfIndex) in shelves"
            :key="shelfIndex"
            class="bookshelf__shelf"
            :style="{ '--shelf': shelfIndex }"
          >
            <ul class="bookshelf__spines">
              <li
                v-for="(title, bookIndex) in shelf"
                :key="title"
                :style="{ '--i': bookIndex }"
              >
                {{ title }}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="home-scrim" />
    </div>

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
      <p class="home-hero__brand">Backlog Shelf</p>
      <h1 id="home-headline" class="home-hero__title">Track the games you’ll play.</h1>
      <p class="home-hero__lede">
        Start date, progress, platform, and release — one personal shelf.
      </p>
      <div class="home-hero__actions">
        <RouterLink
          v-if="auth.isAuthenticated"
          class="home-hero__primary"
          :to="{ name: 'games' }"
        >
          Open my list
        </RouterLink>
        <template v-else>
          <RouterLink class="home-hero__primary" :to="{ name: 'register' }">
            Get started
          </RouterLink>
          <RouterLink class="home-hero__secondary" :to="{ name: 'login' }">
            Log in
          </RouterLink>
        </template>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  overflow: clip;
  display: flex;
  flex-direction: column;
}

.home-stage {
  position: absolute;
  inset: 0;
  z-index: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: clamp(5rem, 12vh, 7rem) clamp(1rem, 4vw, 3.5rem) clamp(1.5rem, 4vh, 3rem);
  animation: stage-in 900ms ease both;
}

.home-stage__glow {
  position: absolute;
  inset: 18% 6% auto auto;
  width: min(34rem, 58vw);
  height: 58%;
  background: radial-gradient(
    ellipse at 70% 45%,
    color-mix(in oklab, var(--color-accent) 22%, transparent),
    transparent 70%
  );
  filter: blur(12px);
  animation: pulse-glow 5s ease-in-out infinite;
}

.bookshelf {
  position: relative;
  z-index: 1;
  width: min(22rem, 44vw);
  animation: case-in 800ms ease both;
}

.bookshelf__case {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0.85rem 0.7rem 0.75rem;
  border-radius: 0.35rem 0.35rem 0.2rem 0.2rem;
  background:
    linear-gradient(180deg, #4a3426 0%, #342318 18%, #2a1c14 100%);
  box-shadow:
    inset 0 0 0 2px #5a4030,
    inset 0 0 0 5px #2b1c13,
    0 24px 50px rgb(0 0 0 / 0.45);
}

.bookshelf__case::before,
.bookshelf__case::after {
  content: '';
  position: absolute;
  top: 0.55rem;
  bottom: 0.55rem;
  width: 0.45rem;
  background: linear-gradient(180deg, #5c4030, #3a271c 50%, #2a1c14);
  box-shadow: inset 0 0 0 1px color-mix(in oklab, white 8%, transparent);
}

.bookshelf__case::before {
  left: 0.2rem;
}

.bookshelf__case::after {
  right: 0.2rem;
}

.bookshelf__shelf {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: clamp(6.5rem, 14vh, 8.5rem);
  padding: 0.35rem 0.55rem 0;
  background: linear-gradient(180deg, #1a120e 0%, #241812 70%, #1c130f 100%);
}

.bookshelf__shelf::after {
  content: '';
  display: block;
  height: 0.55rem;
  margin: 0 -0.15rem;
  border-radius: 0.08rem;
  background: linear-gradient(180deg, #6a4a36, #3f2a1e 55%, #2c1d14);
  box-shadow: 0 6px 12px rgb(0 0 0 / 0.35);
}

.bookshelf__spines {
  list-style: none;
  margin: 0;
  padding: 0 0.15rem;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 0.4rem;
  min-height: clamp(4.8rem, 11vh, 6.8rem);
}

.bookshelf__spines li {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  display: flex;
  align-items: center;
  justify-content: center;
  width: clamp(1.85rem, 3.6vw, 2.55rem);
  height: calc(clamp(4.2rem, 10vh, 6rem) + (var(--i) * 0.45rem));
  border-radius: 0.28rem 0.28rem 0.1rem 0.1rem;
  font-family: var(--font-display);
  font-size: clamp(0.58rem, 1vw, 0.72rem);
  font-weight: 600;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--color-foam);
  box-shadow: inset 0 0 0 1px color-mix(in oklab, white 12%, transparent);
  animation: spine-settle 700ms calc(120ms + (var(--shelf) * 160ms) + (var(--i) * 55ms)) ease both;
}

.bookshelf__spines li:nth-child(odd) {
  background: linear-gradient(180deg, #25463d, #163029);
}

.bookshelf__spines li:nth-child(even) {
  background: linear-gradient(180deg, #2a3f55, #172533);
}

.bookshelf__shelf:nth-child(2) .bookshelf__spines li:nth-child(2) {
  background: linear-gradient(180deg, #3a2f4d, #21182c);
}

.bookshelf__shelf:nth-child(3) .bookshelf__spines li:nth-child(1) {
  background: linear-gradient(180deg, #4a3a28, #2a2016);
}

.home-scrim {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  background:
    linear-gradient(
      105deg,
      rgb(8 14 13 / 0.92) 0%,
      rgb(8 14 13 / 0.78) 38%,
      rgb(8 14 13 / 0.35) 62%,
      rgb(8 14 13 / 0.2) 100%
    ),
    linear-gradient(180deg, rgb(8 14 13 / 0.55) 0%, transparent 35%, rgb(8 14 13 / 0.5) 100%);
}

.home-nav {
  position: relative;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  width: min(72rem, 100%);
  margin: 0 auto;
  padding: 1.25rem 1.5rem;
  animation: rise-in 500ms ease both;
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
  z-index: 3;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: min(36rem, 100%);
  margin: 0 auto 0 max(1.5rem, calc((100% - 72rem) / 2 + 1.5rem));
  padding: 1.5rem 1.5rem 4rem 0;
  animation: rise-in 700ms 80ms ease both;
}

.home-hero__brand {
  margin: 0 0 0.9rem;
  font-family: var(--font-display);
  font-size: clamp(2.75rem, 8vw, 4.75rem);
  font-weight: 700;
  letter-spacing: -0.035em;
  line-height: 0.92;
  color: var(--color-foam);
}

.home-hero__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.25rem, 2.8vw, 1.75rem);
  font-weight: 500;
  line-height: 1.25;
  letter-spacing: -0.015em;
  color: color-mix(in oklab, var(--color-foam) 88%, var(--color-mist));
}

.home-hero__lede {
  margin: 0.85rem 0 0;
  max-width: 28rem;
  color: var(--color-mist);
  font-size: 1.02rem;
  line-height: 1.5;
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
  padding: 0.85rem 1.25rem;
}

.home-hero__primary:hover {
  background: var(--color-accent-dim);
  color: var(--color-foam);
  transform: translateY(-1px);
}

.home-hero__secondary {
  border: 1px solid color-mix(in oklab, var(--color-foam) 28%, var(--color-line));
  color: var(--color-foam);
  padding: 0.85rem 1.25rem;
  background: color-mix(in oklab, var(--color-ink) 35%, transparent);
  backdrop-filter: blur(6px);
}

.home-hero__secondary:hover {
  border-color: color-mix(in oklab, var(--color-foam) 50%, var(--color-line));
  transform: translateY(-1px);
}

@keyframes rise-in {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes stage-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes case-in {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes spine-settle {
  from {
    opacity: 0;
    transform: rotate(180deg) translateY(20px);
  }
  to {
    opacity: 1;
    transform: rotate(180deg) translateY(0);
  }
}

@keyframes pulse-glow {
  0%,
  100% {
    opacity: 0.5;
    transform: scale(0.98);
  }
  50% {
    opacity: 0.85;
    transform: scale(1.04);
  }
}

@media (max-width: 700px) {
  .home-stage {
    align-items: flex-end;
    justify-content: center;
    padding-bottom: 1rem;
  }

  .bookshelf {
    width: min(18rem, 86vw);
  }

  .bookshelf__shelf {
    min-height: 5.6rem;
  }

  .bookshelf__spines {
    min-height: 4.2rem;
  }

  .bookshelf__spines li:nth-child(3) {
    display: none;
  }

  .home-hero {
    justify-content: flex-end;
    padding-bottom: 2.5rem;
    max-width: none;
    margin-left: 1.5rem;
    padding-left: 0;
  }

  .home-scrim {
    background:
      linear-gradient(180deg, rgb(8 14 13 / 0.7) 0%, rgb(8 14 13 / 0.35) 40%, rgb(8 14 13 / 0.88) 100%);
  }

  .home-hero__actions {
    width: 100%;
  }

  .home-hero__primary,
  .home-hero__secondary {
    flex: 1 1 auto;
    text-align: center;
  }
}

@media (prefers-reduced-motion: reduce) {
  .home-nav,
  .home-hero,
  .home-stage,
  .bookshelf,
  .bookshelf__spines li,
  .home-stage__glow {
    animation: none;
  }
}
</style>
