<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { Game, GameInsert, GameStatus } from '../types/game'
import { GAME_STATUSES, STATUS_LABELS } from '../types/game'

const props = defineProps<{
  game?: Game | null
  submitting?: boolean
}>()

const emit = defineEmits<{
  submit: [payload: GameInsert]
  cancel: []
}>()

const form = reactive({
  title: '',
  platform: '',
  last_played_date: '',
  started_at: '',
  status: 'want_to_play' as GameStatus,
})

function syncFromGame(game: Game | null | undefined) {
  form.title = game?.title ?? ''
  form.platform = game?.platform ?? ''
  form.last_played_date = game?.last_played_date ?? ''
  form.started_at = game?.started_at ?? ''
  form.status = game?.status ?? 'want_to_play'
}

watch(
  () => props.game,
  (game) => syncFromGame(game),
  { immediate: true },
)

function onSubmit() {
  emit('submit', {
    title: form.title.trim(),
    platform: form.platform.trim(),
    last_played_date: form.last_played_date || null,
    started_at: form.started_at || null,
    status: form.status,
  })
}
</script>

<template>
  <form class="grid gap-4 md:grid-cols-2" @submit.prevent="onSubmit">
    <label class="md:col-span-2">
      <span class="mb-1.5 block text-sm text-mist">Title</span>
      <input
        v-model="form.title"
        required
        maxlength="200"
        class="w-full rounded-lg border border-line bg-ink/60 px-3 py-2 text-foam outline-none ring-accent/40 focus:ring-2"
        placeholder="Elden Ring"
      />
    </label>

    <label>
      <span class="mb-1.5 block text-sm text-mist">Platform</span>
      <input
        v-model="form.platform"
        required
        maxlength="80"
        class="w-full rounded-lg border border-line bg-ink/60 px-3 py-2 text-foam outline-none ring-accent/40 focus:ring-2"
        placeholder="PC, PS5, Switch…"
      />
    </label>

    <label>
      <span class="mb-1.5 block text-sm text-mist">Status</span>
      <select
        v-model="form.status"
        class="w-full rounded-lg border border-line bg-ink/60 px-3 py-2 text-foam outline-none ring-accent/40 focus:ring-2"
      >
        <option v-for="status in GAME_STATUSES" :key="status" :value="status">
          {{ STATUS_LABELS[status] }}
        </option>
      </select>
    </label>

    <label>
      <span class="mb-1.5 block text-sm text-mist">Last Played Date</span>
      <input
        v-model="form.last_played_date"
        type="date"
        class="w-full rounded-lg border border-line bg-ink/60 px-3 py-2 text-foam outline-none ring-accent/40 focus:ring-2"
      />
    </label>

    <label>
      <span class="mb-1.5 block text-sm text-mist">Date started</span>
      <input
        v-model="form.started_at"
        type="date"
        class="w-full rounded-lg border border-line bg-ink/60 px-3 py-2 text-foam outline-none ring-accent/40 focus:ring-2"
      />
    </label>


    <div class="flex flex-wrap gap-3 md:col-span-2">
      <button
        type="submit"
        :disabled="submitting"
        class="rounded-lg bg-accent px-4 py-2 font-medium text-ink transition hover:bg-accent-dim hover:text-foam disabled:opacity-60"
      >
        {{ game ? 'Save changes' : 'Add game' }}
      </button>
      <button
        v-if="game"
        type="button"
        class="rounded-lg border border-line px-4 py-2 text-mist transition hover:border-foam/40 hover:text-foam"
        @click="emit('cancel')"
      >
        Cancel
      </button>
    </div>
  </form>
</template>
