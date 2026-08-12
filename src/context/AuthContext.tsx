import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { AuthUser } from '../types'

interface AuthContextValue {
  token: string | null
  user: AuthUser | null
  isAuthenticated: boolean
  setSession: (token: string, user?: AuthUser | null) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const STORAGE_KEY = 'eduadmin_auth'

function loadStoredSession(): { token: string | null; user: AuthUser | null } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { token: null, user: null }
    const parsed = JSON.parse(raw)
    return { token: parsed.token ?? null, user: parsed.user ?? null }
  } catch {
    return { token: null, user: null }
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [{ token, user }, setState] = useState(loadStoredSession)

  const setSession = useCallback((newToken: string, newUser: AuthUser | null = null) => {
    setState({ token: newToken, user: newUser })
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: newToken, user: newUser }))
  }, [])

  const logout = useCallback(() => {
    setState({ token: null, user: null })
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated: !!token, setSession, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
