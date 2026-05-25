import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react'
import api, { tokenStore } from '../api/axios'

export type Me = {
  id: number
  email: string
  nickname: string
  role: 'USER' | 'OWNER' | 'ADMIN'
  profileImage?: string | null
}

type AppContextValue = {
  me: Me | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  loginWithTokens: (access: string, refresh: string) => Promise<void>
  logout: () => void
  refreshMe: () => Promise<void>
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [me, setMe] = useState<Me | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshMe = useCallback(async () => {
    if (!tokenStore.get()) {
      setMe(null)
      return
    }
    try {
      const { data } = await api.get<Me>('/users/me')
      setMe(data)
    } catch {
      setMe(null)
      tokenStore.clear()
    }
  }, [])

  useEffect(() => {
    refreshMe().finally(() => setLoading(false))
  }, [refreshMe])

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password })
    tokenStore.set(data.accessToken, data.refreshToken)
    await refreshMe()
  }, [refreshMe])

  const loginWithTokens = useCallback(async (access: string, refresh: string) => {
    tokenStore.set(access, refresh)
    await refreshMe()
  }, [refreshMe])

  const logout = useCallback(() => {
    tokenStore.clear()
    setMe(null)
  }, [])

  return (
    <AppContext.Provider value={{ me, loading, login, loginWithTokens, logout, refreshMe }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('AppProvider 안에서만 사용 가능합니다.')
  return ctx
}

export default AppProvider
