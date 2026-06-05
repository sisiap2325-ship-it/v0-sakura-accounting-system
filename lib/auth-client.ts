'use client'

import { useEffect, useState, useCallback } from 'react'

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

// Event emitter untuk sinkronisasi session antar hook
class SessionEmitter {
  private listeners: ((session: Session | null) => void)[] = []

  subscribe(listener: (session: Session | null) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  emit(session: Session | null) {
    this.listeners.forEach(listener => listener(session))
  }
}

const sessionEmitter = new SessionEmitter()

// Simple client-side session management
export function useSession() {
  const [session, setSession] = useState<Session | null>(null)
  const [isPending, setIsPending] = useState(true)

  useEffect(() => {
    // Load session from localStorage
    const stored = localStorage.getItem('auth_session')
    if (stored) {
      try {
        const parsedSession = JSON.parse(stored)
        setSession(parsedSession)
      } catch (e) {
        console.error('Failed to parse session')
        localStorage.removeItem('auth_session')
      }
    }
    setIsPending(false)

    // Subscribe to session changes
    const unsubscribe = sessionEmitter.subscribe((newSession) => {
      setSession(newSession)
    })

    // Listen for storage changes (sign-in/sign-out from other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_session') {
        if (e.newValue) {
          try {
            const parsedSession = JSON.parse(e.newValue)
            setSession(parsedSession)
          } catch (err) {
            console.error('Failed to parse session')
          }
        } else {
          setSession(null)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      unsubscribe()
    }
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
  sessionEmitter.emit(session)
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
  sessionEmitter.emit(session)
  return session
}

export async function signOut() {
  localStorage.removeItem('auth_session')
  sessionEmitter.emit(null)
}

export const authClient = {
  signIn,
  signUp,
  signOut,
}
