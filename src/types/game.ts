export const GAME_STATUSES = [
  'want_to_play',
  'playing',
  'finished',
  'dropped',
] as const

export type GameStatus = (typeof GAME_STATUSES)[number]

export interface Game {
  id: string
  user_id: string
  title: string
  platform: string
  last_played_date: string | null
  started_at: string | null
  status: GameStatus
  created_at: string
  updated_at: string
}

export type GameInsert = {
  title: string
  platform: string
  last_played_date?: string | null
  started_at?: string | null
  status: GameStatus
}

export type GameUpdate = Partial<GameInsert>

export const STATUS_LABELS: Record<GameStatus, string> = {
  want_to_play: 'Want to play',
  playing: 'Playing',
  finished: 'Finished',
  dropped: 'Dropped',
}
