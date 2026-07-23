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
  release_date: '',
  started_at: '',
  status: 'want_to_play' as GameStatus,
  progress_percent: '' as string,
})

function syncFromGame(game: Game | null | undefined) {
  form.title = game?.title ?? ''
  form.platform = game?.platform ?? ''
  form.release_date = game?.release_date ?? ''
  form.started_at = game?.started_at ?? ''
  form.status = game?.status ?? 'want_to_play'
  form.progress_percent =
    game?.progress_percent === null || game?.progress_percent === undefined
      ? ''
      : String(game.progress_percent)
}

watch(
  () => props.game,
  (game) => syncFromGame(game),
  { immediate: true },
)

function onSubmit() {
  const percentRaw = form.progress_percent.trim()
  let progress_percent: number | null = null
  if (percentRaw !== '') {
    const parsed = Number(percentRaw)
    if (Number.isNaN(parsed) || parsed < 0 || parsed > 100) {
      return
    }
    progress_percent = Math.round(parsed)
  }

  emit('submit', {
    title: form.title.trim(),
    platform: form.platform.trim(),
    release_date: form.release_date || null,
    started_at: form.started_at || null,
    status: form.status,
    progress_percent,
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
      <span class="mb-1.5 block text-sm text-mist">Release date</span>
      <input
        v-model="form.release_date"
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

    <label class="md:col-span-2">
      <span class="mb-1.5 block text-sm text-mist">Progress % (optional)</span>
      <input
        v-model="form.progress_percent"
        type="number"
        min="0"
        max="100"
        step="1"
        class="w-full rounded-lg border border-line bg-ink/60 px-3 py-2 text-foam outline-none ring-accent/40 focus:ring-2"
        placeholder="0–100"
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
