import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
})

const TOKEN_KEY = '24eum.accessToken'
const REFRESH_KEY = '24eum.refreshToken'

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_KEY),
  set: (access: string, refresh: string) => {
    localStorage.setItem(TOKEN_KEY, access)
    localStorage.setItem(REFRESH_KEY, refresh)
  },
  clear: () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_KEY)
  },
}

api.interceptors.request.use((config) => {
  const token = tokenStore.get()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let refreshing: Promise<string> | null = null

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (
      error.response?.status === 401 &&
      !original._retry &&
      tokenStore.getRefresh() &&
      !original.url?.includes('/auth/')
    ) {
      original._retry = true
      try {
        refreshing ??= (async () => {
          const { data } = await axios.post('/api/auth/refresh', {
            refreshToken: tokenStore.getRefresh(),
          })
          tokenStore.set(data.accessToken, data.refreshToken)
          return data.accessToken as string
        })()
        const newToken = await refreshing
        refreshing = null
        original.headers.Authorization = `Bearer ${newToken}`
        return api(original)
      } catch (e) {
        refreshing = null
        tokenStore.clear()
      }
    }
    return Promise.reject(error)
  }
)

export default api
