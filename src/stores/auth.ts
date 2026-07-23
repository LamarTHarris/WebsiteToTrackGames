import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Session, User } from '@supabase/supabase-js'
import { assertSupabaseConfigured, supabase } from '../lib/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const session = ref<Session | null>(null)
  const loading = ref(true)
  const error = ref<string | null>(null)
  const initialized = ref(false)

  const isAuthenticated = computed(() => !!session.value)

  async function init() {
    if (initialized.value) {
      return
    }
    initialized.value = true
    loading.value = true
    error.value = null

    const { data, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) {
      error.value = sessionError.message
    } else {
      session.value = data.session
      user.value = data.session?.user ?? null
    }

    supabase.auth.onAuthStateChange((_event, nextSession) => {
      session.value = nextSession
      user.value = nextSession?.user ?? null
    })

    loading.value = false
  }

  async function signIn(email: string, password: string) {
    error.value = null
    assertSupabaseConfigured()
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (signInError) {
      error.value = signInError.message
      throw signInError
    }
    session.value = data.session
    user.value = data.user
  }

  async function signUp(email: string, password: string) {
    error.value = null
    assertSupabaseConfigured()
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    })
    if (signUpError) {
      error.value = signUpError.message
      throw signUpError
    }
    session.value = data.session
    user.value = data.user
    return data
  }

  async function signOut() {
    error.value = null
    const { error: signOutError } = await supabase.auth.signOut()
    if (signOutError) {
      error.value = signOutError.message
      throw signOutError
    }
    session.value = null
    user.value = null
  }

  return {
    user,
    session,
    loading,
    error,
    isAuthenticated,
    init,
    signIn,
    signUp,
    signOut,
  }
})
