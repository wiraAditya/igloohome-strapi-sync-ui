<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
    <div class="w-full max-w-md">
      <!-- Logo or Branding Space -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Strapi Sync</h1>
        <p class="text-slate-500 dark:text-slate-400 mt-2 font-medium">Authentication required</p>
      </div>

      <!-- Login Card -->
      <div class="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-8">
        <form @submit.prevent="handleLogin" class="space-y-6">
          
          <!-- Identifier / Email -->
          <div>
            <label for="identifier" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Email or Username
            </label>
            <input
              id="identifier"
              v-model="identifier"
              type="text"
              required
              class="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm outline-none"
              placeholder="admin@example.com"
              :disabled="isLoading"
            />
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Password
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="w-full px-4 py-2.5 pr-12 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm outline-none"
                placeholder="••••••••"
                :disabled="isLoading"
              />
              <button
                type="button"
                @click="togglePassword"
                tabindex="-1"
                class="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors focus:outline-none"
              >
                <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                  <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                  <line x1="2" y1="2" x2="22" y2="22"></line>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </button>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-sm font-medium">
            {{ error }}
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full flex justify-center items-center py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isLoading ? 'Signing in...' : 'Sign in' }}
          </button>
        </form>
      </div>

      <!-- Footer Info -->
      <p class="text-center text-xs text-slate-400 dark:text-slate-500 mt-6">
        Secure Strapi Sync Interface
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: 'blank'
})

const router = useRouter()
const authStore = useAuthStore()

const identifier = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const error = ref('')

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

// Clear error when user types
const clearError = () => {
  if (error.value) error.value = ''
}

// Watch inputs
watch([identifier, password], clearError)

const handleLogin = async () => {
  if (!identifier.value || !password.value) return
  
  isLoading.value = true
  error.value = ''
  
  try {
    await authStore.login({
      identifier: identifier.value,
      password: password.value
    })
    
    // Redirect to home upon successful login
    router.push('/')
  } catch (err: any) {
    error.value = err.data?.statusMessage || err.message || 'Invalid credentials'
  } finally {
    isLoading.value = false
  }
}
</script>
