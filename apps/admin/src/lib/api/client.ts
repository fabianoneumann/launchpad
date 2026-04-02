import axios from 'axios'
import { useAuthStore } from '@/features/auth/store/auth-store'
import { router } from '@/app/router'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

const SKIP_REFRESH_URLS = [
  '/auth/me/password',
  '/auth/token/refresh',
  '/auth/admin/login',
  '/auth/login',
  '/auth/logout',
]

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401) {
      const requestUrl = originalRequest?.url ?? ''

      if (SKIP_REFRESH_URLS.some((url) => requestUrl.includes(url))) {
        return Promise.reject(error)
      }

      if (originalRequest._retry) {
        useAuthStore.getState().clearSession()
        router.navigate({ to: '/login' })
        return Promise.reject(error)
      }

      originalRequest._retry = true

      try {
        const { data } = await api.patch<{ token: string }>('/auth/token/refresh')
        useAuthStore.getState().setToken(data.token)
        originalRequest.headers.Authorization = `Bearer ${data.token}`
        return api(originalRequest)
      } catch {
        useAuthStore.getState().clearSession()
        router.navigate({ to: '/login' })
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  },
)
