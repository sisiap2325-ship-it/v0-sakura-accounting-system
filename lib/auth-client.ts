'use client'

import { useEffect, useState } from 'react'

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'staff' | 'viewer'
}

export interface Session {
  user: User
  token: string
}

// Simple client-side session management
export function useSession() {
  const [session, setSession] = useState<Session | null>(null)
  const [isPending, setIsPending] = useState(true)

  useEffect(() => {
    // Load session from localStorage
    const stored = localStorage.getItem('auth_session')
    if (stored) {
      try {
        setSession(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to parse session')
      }
    }
    setIsPending(false)

    // Listen for storage changes (sign-in/sign-out from other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_session') {
        if (e.newValue) {
          try {
            setSession(JSON.parse(e.newValue))
          } catch (err) {
            console.error('Failed to parse session')
          }
        } else {
          setSession(null)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  return { data: session, isPending }
}

export async function signIn(email: string, password: string) {
  const response = await fetch('/api/auth/signin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Sign in failed')
  }

  const session = await response.json()
  localStorage.setItem('auth_session', JSON.stringify(session))
  return session
}

export async function signUp(email: string, password: string, name: string) {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Sign up failed')
  }

  const session = await response.json()
  localStorage.setItem('auth_session', JSON.stringify(session))
  return session
}

export async function signOut() {
  localStorage.removeItem('auth_session')
}

export const authClient = {
  signIn,
  signUp,
  signOut,
}
