<script setup lang="ts">
import { useUiStore } from '~/stores/ui'

const uiStore = useUiStore()
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="uiStore.isLoading"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-indigo-950/20 dark:bg-slate-950/40 backdrop-blur-sm pointer-events-auto"
      >
        <div class="relative flex flex-col items-center gap-6 p-12 bg-white/80 dark:bg-slate-900/80 rounded-[3rem] shadow-2xl border border-white/20 dark:border-slate-800/50 backdrop-blur-xl">
          <div class="relative">
            <div class="w-16 h-16 rounded-full border-4 border-indigo-100 dark:border-indigo-900/30 border-t-indigo-600 animate-spin shadow-inner"></div>
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="w-2 h-2 bg-indigo-600 rounded-full animate-pulse shadow-glow"></div>
            </div>
          </div>
          <div class="flex flex-col items-center gap-1">
            <p class="text-xs font-black uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-400">Processing</p>
            <p class="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest animate-pulse">Syncing Engine Active</p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.shadow-glow {
  box-shadow: 0 0 15px rgba(79, 70, 229, 0.6);
}
</style>
