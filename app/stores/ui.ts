import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  timeout?: number
}

export interface ConfirmDialogOptions {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'info' | 'warning' | 'danger'
  onConfirm?: () => void | Promise<void>
  onCancel?: () => void
}

export const useUiStore = defineStore('ui', () => {
  const toasts = ref<Toast[]>([])
  const isLoading = ref(false)
  const confirmDialog = ref<{
    isOpen: boolean
    options: ConfirmDialogOptions
  }>({
    isOpen: false,
    options: {
      title: '',
      message: '',
    },
  })

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

  const confirm = (options: ConfirmDialogOptions) => {
    confirmDialog.value = {
      isOpen: true,
      options: {
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        type: 'info',
        ...options,
      },
    }
  }

  const closeConfirm = () => {
    confirmDialog.value.isOpen = false
  }

  return {
    toasts,
    isLoading,
    confirmDialog,
    addToast,
    removeToast,
    setLoading,
    confirm,
    closeConfirm,
  }
})
