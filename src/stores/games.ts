import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { supabase } from '../lib/supabase'
import { useAuthStore } from './auth'
import type { Game, GameInsert, GameStatus, GameUpdate } from '../types/game'

export const useGamesStore = defineStore('games', () => {
  const games = ref<Game[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const statusFilter = ref<GameStatus | 'all'>('all')

  const filteredGames = computed(() => {
    if (statusFilter.value === 'all') return games.value
    return games.value.filter((game) => game.status === statusFilter.value)
  })

  async function fetchGames() {
    const auth = useAuthStore()
    if (!auth.user) {
      games.value = []
      return
    }

    loading.value = true
    error.value = null

    const { data, error: fetchError } = await supabase
      .from('games')
      .select('*')
      .eq('user_id', auth.user.id)
      .order('updated_at', { ascending: false })

    if (fetchError) {
      error.value = fetchError.message
      loading.value = false
      throw fetchError
    }

    games.value = (data ?? []) as Game[]
    loading.value = false
  }

  async function addGame(payload: GameInsert) {
    const auth = useAuthStore()
    if (!auth.user) throw new Error('You must be signed in to add a game.')

    error.value = null
    const { data, error: insertError } = await supabase
      .from('games')
      .insert({
        ...payload,
        user_id: auth.user.id,
        progress_percent: payload.progress_percent ?? null,
        release_date: payload.release_date || null,
        started_at: payload.started_at || null,
      })
      .select()
      .single()

    if (insertError) {
      error.value = insertError.message
      throw insertError
    }

    games.value = [data as Game, ...games.value]
    return data as Game
  }

  async function updateGame(id: string, payload: GameUpdate) {
    error.value = null
    const { data, error: updateError } = await supabase
      .from('games')
      .update({
        ...payload,
        progress_percent:
          payload.progress_percent === undefined
            ? undefined
            : payload.progress_percent,
        release_date:
          payload.release_date === undefined
            ? undefined
            : payload.release_date || null,
        started_at:
          payload.started_at === undefined
            ? undefined
            : payload.started_at || null,
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      error.value = updateError.message
      throw updateError
    }

    const updated = data as Game
    games.value = games.value.map((game) =>
      game.id === id ? updated : game,
    )
    return updated
  }

  async function deleteGame(id: string) {
    error.value = null
    const { error: deleteError } = await supabase.from('games').delete().eq('id', id)

    if (deleteError) {
      error.value = deleteError.message
      throw deleteError
    }

    games.value = games.value.filter((game) => game.id !== id)
  }

  return {
    games,
    loading,
    error,
    statusFilter,
    filteredGames,
    fetchGames,
    addGame,
    updateGame,
    deleteGame,
  }
})
