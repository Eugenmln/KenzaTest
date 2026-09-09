import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getProfile, login, register } from '../services/api.js'

const AuthContext = createContext(null)
const TOKEN_STORAGE_KEY = 'kova-auth-token'

function toUser(data) {
  if (!data) return null
  return {
    id: data.userId || data.id,
    fullName: data.fullName,
    email: data.email,
    phone: data.phone || '',
    role: data.role,
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY))
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(Boolean(token))

  useEffect(() => {
    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)

    getProfile(token)
      .then((profile) => {
        if (!cancelled) setUser(toUser(profile))
      })
      .catch(() => {
        if (!cancelled) {
          localStorage.removeItem(TOKEN_STORAGE_KEY)
          setToken(null)
          setUser(null)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [token])

  async function authenticate(action) {
    try {
      const data = await action()
      localStorage.setItem(TOKEN_STORAGE_KEY, data.token)
      setToken(data.token)
      setUser(toUser(data))
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const value = useMemo(() => ({
    user,
    token,
    loading,
    configured: true,
    signIn: (email, password) => authenticate(() => login(email, password)),
    signUp: (email, password, fullName) => authenticate(() => register(email, password, fullName)),
    signOut: async () => {
      localStorage.removeItem(TOKEN_STORAGE_KEY)
      setToken(null)
      setUser(null)
    },
  }), [user, token, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
