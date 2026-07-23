<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { LogOut, Plus } from 'lucide-vue-next'
import GameForm from '../components/GameForm.vue'
import GameRow from '../components/GameRow.vue'
import { useAuthStore } from '../stores/auth'
import { useGamesStore } from '../stores/games'
import type { Game, GameInsert, GameStatus } from '../types/game'
import { GAME_STATUSES, STATUS_LABELS } from '../types/game'

const auth = useAuthStore()
const gamesStore = useGamesStore()
const router = useRouter()

const showForm = ref(false)
const editingGame = ref<Game | null>(null)
const submitting = ref(false)
const formError = ref<string | null>(null)

onMounted(async () => {
  try {
    await gamesStore.fetchGames()
  } catch {
    // error surfaced via store
  }
})

function openCreate() {
  editingGame.value = null
  showForm.value = true
  formError.value = null
}

function openEdit(game: Game) {
  editingGame.value = game
  showForm.value = true
  formError.value = null
}

function closeForm() {
  showForm.value = false
  editingGame.value = null
  formError.value = null
}

async function onSubmit(payload: GameInsert) {
  submitting.value = true
  formError.value = null
  try {
    if (editingGame.value) {
      await gamesStore.updateGame(editingGame.value.id, payload)
    } else {
      await gamesStore.addGame(payload)
    }
    closeForm()
  } catch (err) {
    formError.value = err instanceof Error ? err.message : 'Could not save game.'
  } finally {
    submitting.value = false
  }
}

async function onRemove(game: Game) {
  if (!confirm(`Delete “${game.title}”?`)) return
  try {
    await gamesStore.deleteGame(game.id)
    if (editingGame.value?.id === game.id) closeForm()
  } catch {
    // error surfaced via store
  }
}

async function onSignOut() {
  await auth.signOut()
  await router.replace({ name: 'login' })
}

function setFilter(value: GameStatus | 'all') {
  gamesStore.statusFilter = value
}
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-8">
    <header class="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="font-display text-sm tracking-[0.2em] text-accent uppercase">Backlog Shelf</p>
        <h1 class="mt-1 font-display text-3xl font-semibold text-foam md:text-4xl">
          Your games
        </h1>
        <p class="mt-2 text-sm text-mist">
          Track start date, progress, platform, and release date.
        </p>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <p class="mr-2 text-sm text-mist">{{ auth.user?.email }}</p>
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm text-mist transition hover:border-foam/40 hover:text-foam"
          @click="onSignOut"
        >
          <LogOut class="h-4 w-4" />
          Sign out
        </button>
      </div>
    </header>

    <section class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          class="rounded-full border px-3 py-1.5 text-sm transition"
          :class="
            gamesStore.statusFilter === 'all'
              ? 'border-accent bg-accent/15 text-accent'
              : 'border-line text-mist hover:border-foam/40 hover:text-foam'
          "
          @click="setFilter('all')"
        >
          All
        </button>
        <button
          v-for="status in GAME_STATUSES"
          :key="status"
          type="button"
          class="rounded-full border px-3 py-1.5 text-sm transition"
          :class="
            gamesStore.statusFilter === status
              ? 'border-accent bg-accent/15 text-accent'
              : 'border-line text-mist hover:border-foam/40 hover:text-foam'
          "
          @click="setFilter(status)"
        >
          {{ STATUS_LABELS[status] }}
        </button>
      </div>

      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 font-medium text-ink transition hover:bg-accent-dim hover:text-foam"
        @click="openCreate"
      >
        <Plus class="h-4 w-4" />
        Add game
      </button>
    </section>

    <section
      v-if="showForm"
      class="mb-6 rounded-2xl border border-line bg-panel/80 p-5 backdrop-blur"
    >
      <h2 class="mb-4 font-display text-xl font-semibold text-foam">
        {{ editingGame ? 'Edit game' : 'Add a game' }}
      </h2>
      <p
        v-if="formError"
        class="mb-4 rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger"
      >
        {{ formError }}
      </p>
      <GameForm
        :game="editingGame"
        :submitting="submitting"
        @submit="onSubmit"
        @cancel="closeForm"
      />
    </section>

    <p
      v-if="gamesStore.error"
      class="mb-4 rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger"
    >
      {{ gamesStore.error }}
    </p>

    <section class="overflow-hidden rounded-2xl border border-line bg-panel/70 backdrop-blur">
      <div v-if="gamesStore.loading" class="px-4 py-10 text-center text-mist">
        Loading your list…
      </div>

      <div
        v-else-if="gamesStore.filteredGames.length === 0"
        class="px-4 py-12 text-center"
      >
        <p class="font-display text-lg text-foam">No games here yet</p>
        <p class="mt-2 text-sm text-mist">
          {{
            gamesStore.statusFilter === 'all'
              ? 'Add the first title to your backlog.'
              : 'Nothing matches this status filter.'
          }}
        </p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full text-left">
          <thead class="border-b border-line bg-panel-2/80 text-xs tracking-wide text-mist uppercase">
            <tr>
              <th class="px-3 py-3 font-medium">Title</th>
              <th class="hidden px-3 py-3 font-medium md:table-cell">Platform</th>
              <th class="hidden px-3 py-3 font-medium lg:table-cell">Release</th>
              <th class="hidden px-3 py-3 font-medium lg:table-cell">Started</th>
              <th class="px-3 py-3 font-medium">Status</th>
              <th class="px-3 py-3 font-medium">Progress</th>
              <th class="px-3 py-3 font-medium"><span class="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            <GameRow
              v-for="game in gamesStore.filteredGames"
              :key="game.id"
              :game="game"
              @edit="openEdit(game)"
              @remove="onRemove(game)"
            />
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
