<script setup lang="ts">
import { format, parseISO } from 'date-fns'
import { Pencil, Trash2 } from 'lucide-vue-next'
import type { Game } from '../types/game'
import { STATUS_LABELS } from '../types/game'

defineProps<{
  game: Game
}>()

const emit = defineEmits<{
  edit: []
  remove: []
}>()

function formatDate(value: string | null) {
  if (!value) return '—'
  try {
    return format(parseISO(value), 'MMM d, yyyy')
  } catch {
    return value
  }
}
</script>

<template>
  <tr class="border-b border-line/70 last:border-b-0">
    <td class="px-3 py-3 align-top">
      <p class="font-medium text-foam">{{ game.title }}</p>
      <p class="mt-1 text-xs text-mist md:hidden">{{ game.platform }}</p>
    </td>
    <td class="hidden px-3 py-3 align-top text-sm text-mist md:table-cell">
      {{ game.platform || '—' }}
    </td>
    <td class="hidden px-3 py-3 align-top text-sm text-mist lg:table-cell">
      {{ formatDate(game.last_played_date) }}
    </td>
    <td class="hidden px-3 py-3 align-top text-sm text-mist lg:table-cell">
      {{ formatDate(game.started_at) }}
    </td>
    <td class="px-3 py-3 align-top">
      <span
        class="inline-flex rounded-full border border-line bg-panel-2 px-2.5 py-1 text-xs text-foam"
      >
        {{ STATUS_LABELS[game.status] }}
      </span>
      <p class="mt-1 text-xs text-mist lg:hidden">
        Started {{ formatDate(game.started_at) }}
      </p>
    </td>
    <td class="px-3 py-3 align-top">
      <div class="flex justify-end gap-1">
        <button
          type="button"
          class="rounded-lg p-2 text-mist transition hover:bg-panel-2 hover:text-foam"
          title="Edit"
          @click="emit('edit')"
        >
          <Pencil class="h-4 w-4" />
        </button>
        <button
          type="button"
          class="rounded-lg p-2 text-mist transition hover:bg-danger/15 hover:text-danger"
          title="Delete"
          @click="emit('remove')"
        >
          <Trash2 class="h-4 w-4" />
        </button>
      </div>
    </td>
  </tr>
</template>
