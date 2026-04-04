<script setup lang="ts">
import { useUiStore } from '~/stores/ui'

const uiStore = useUiStore()

const handleConfirm = async () => {
  if (uiStore.confirmDialog.options.onConfirm) {
    await uiStore.confirmDialog.options.onConfirm()
  }
  uiStore.closeConfirm()
}

const handleCancel = () => {
  if (uiStore.confirmDialog.options.onCancel) {
    uiStore.confirmDialog.options.onCancel()
  }
  uiStore.closeConfirm()
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="uiStore.confirmDialog.isOpen"
        class="fixed inset-0 z-[60] flex items-center justify-center p-4"
      >
        <!-- Backdrop -->
        <div 
          class="absolute inset-0 bg-indigo-950/60 dark:bg-slate-950/80 backdrop-blur-md" 
          @click="handleCancel"
        ></div>
        
        <!-- Modal Content -->
        <div class="relative bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 dark:border-slate-800 transform transition-all">
          <div class="p-8 sm:p-10 text-center">
            <!-- Icon based on type -->
            <div
              v-if="uiStore.confirmDialog.options.type === 'danger'"
              class="w-16 h-16 mx-auto rounded-2xl bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center text-rose-500 mb-6 shadow-inner"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <div
              v-else-if="uiStore.confirmDialog.options.type === 'warning'"
              class="w-16 h-16 mx-auto rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-500 mb-6 shadow-inner"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
            </div>
            <div
              v-else
              class="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-500 mb-6 shadow-inner"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            </div>

            <h3 class="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-3 uppercase">
              {{ uiStore.confirmDialog.options.title }}
            </h3>
            <p class="text-gray-500 dark:text-slate-400 font-medium leading-relaxed">
              {{ uiStore.confirmDialog.options.message }}
            </p>
          </div>

          <div class="bg-gray-50 dark:bg-slate-800/50 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-center gap-4 border-t border-gray-100 dark:border-slate-800">
            <button
              type="button"
              class="w-full sm:w-auto px-6 py-3 text-xs font-black uppercase tracking-[0.2em] text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              @click="handleCancel"
            >
              {{ uiStore.confirmDialog.options.cancelText || 'Cancel' }}
            </button>
            <button
              type="button"
              class="w-full sm:w-auto px-10 py-3 text-white text-xs font-black uppercase tracking-[0.2em] rounded-xl transition-all shadow-xl active:scale-95"
              :class="[
                uiStore.confirmDialog.options.type === 'danger' 
                  ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-100 dark:shadow-rose-950/40' 
                  : uiStore.confirmDialog.options.type === 'warning'
                    ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-100 dark:shadow-amber-950/40'
                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100 dark:shadow-indigo-950/40'
              ]"
              @click="handleConfirm"
            >
              {{ uiStore.confirmDialog.options.confirmText || 'Confirm' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
