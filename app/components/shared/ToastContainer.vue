<script setup lang="ts">
import { useUiStore } from '~/stores/ui'

const uiStore = useUiStore()

const getIcon = (type: string) => {
  switch (type) {
    case 'success':
      return 'check-circle'
    case 'error':
      return 'alert-circle'
    case 'warning':
      return 'alert-triangle'
    default:
      return 'info'
  }
}

const getTypeClasses = (type: string) => {
  switch (type) {
    case 'success':
      return 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-400'
    case 'error':
      return 'bg-rose-50 dark:bg-rose-900/30 border-rose-100 dark:border-rose-800/50 text-rose-800 dark:text-rose-400'
    case 'warning':
      return 'bg-amber-50 dark:bg-amber-900/30 border-amber-100 dark:border-amber-800/50 text-amber-800 dark:text-amber-400'
    default:
      return 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-100 dark:border-indigo-800/50 text-indigo-800 dark:text-indigo-400'
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed top-4 right-4 z-[70] flex flex-col gap-3 pointer-events-none"
    >
      <TransitionGroup
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="translate-x-full opacity-0"
        enter-to-class="translate-x-0 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="translate-x-0 opacity-100"
        leave-to-class="translate-x-full opacity-0"
      >
        <div
          v-for="toast in uiStore.toasts"
          :key="toast.id"
          class="pointer-events-auto min-w-[320px] max-w-md p-4 rounded-2xl border backdrop-blur-xl shadow-2xl transition-all duration-300"
          :class="getTypeClasses(toast.type)"
        >
          <div class="flex items-start gap-3">
            <div class="shrink-0 mt-0.5">
              <!-- Inline Icons -->
              <svg v-if="toast.type === 'success'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <svg v-else-if="toast.type === 'error'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <svg v-else-if="toast.type === 'warning'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            </div>
            <div class="flex-1">
              <p class="text-xs font-black uppercase tracking-widest opacity-60 mb-1">{{ toast.type }}</p>
              <p class="text-sm font-bold leading-snug">
                {{ toast.message }}
              </p>
            </div>
            <button
              @click="uiStore.removeToast(toast.id)"
              class="shrink-0 p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors opacity-40 hover:opacity-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>
