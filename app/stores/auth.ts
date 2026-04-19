import { defineStore } from 'pinia'

export interface StrapiRole {
  id: number;
  name: string;
  description: string;
  type: string;
}

export interface StrapiUser {
  id: number;
  username: string;
  email: string;
  provider?: string;
  confirmed?: boolean;
  blocked?: boolean;
  createdAt?: string;
  updatedAt?: string;
  role?: StrapiRole;
}

export const useAuthStore = defineStore('auth', () => {
  const userCookie = useCookie<StrapiUser | null>('strapi_user')
  const user = ref<StrapiUser | null>(userCookie.value || null)
  
  const isAuthenticated = computed(() => !!user.value)

  const login = async (credentials: { identifier: string; password: string }) => {
    try {
      const response = await $fetch<{ user: StrapiUser }>('/api/auth/login', {
        method: 'POST',
        body: credentials
      })
      
      if (response && response.user) {
        user.value = response.user
      }
    } catch (error: any) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      user.value = null
      userCookie.value = null
      navigateTo('/login')
    }
  }

  return {
    user,
    isAuthenticated,
    login,
    logout
  }
})
