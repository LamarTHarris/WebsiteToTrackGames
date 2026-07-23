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
    const normalizedEmail = email.trim().toLowerCase()
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
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
    const normalizedEmail = email.trim().toLowerCase()
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
    })

    if (signUpError) {
      const message = /already|registered|exists/i.test(signUpError.message)
        ? 'An account with this email already exists. Try signing in instead.'
        : signUpError.message
      error.value = message
      throw new Error(message)
    }

    // When email confirmation is on, Supabase may return a user with no identities
    // for an existing email (avoids leaking whether the email is taken).
    const identities = data.user?.identities ?? []
    if (data.user && identities.length === 0) {
      const message =
        'An account with this email already exists. Try signing in instead.'
      error.value = message
      throw new Error(message)
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
