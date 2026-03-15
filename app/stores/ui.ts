import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
  timeout?: number
}

export const useUiStore = defineStore('ui', () => {
  const toasts = ref<Toast[]>([])
  const isLoading = ref(false)

  const addToast = (message: string, type: Toast['type'] = 'info', timeout = 5000) => {
    const id = Math.random().toString(36).substring(2, 9)
    const toast: Toast = { id, message, type, timeout }
    toasts.value.push(toast)

    if (timeout > 0) {
      setTimeout(() => {
        removeToast(id)
      }, timeout)
    }
  }

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }

  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  return {
    toasts,
    isLoading,
    addToast,
    removeToast,
    setLoading
  }
})
