export default defineNuxtRouteMiddleware((to) => {
  const user = useCookie<any>('strapi_user')

  // Public routes that don't require authentication
  const isPublicRoute = to.path === '/login'

  // If user is not authenticated and trying to access a protected route
  if (!user.value && !isPublicRoute) {
    return navigateTo('/login')
  }

  // If user is authenticated and trying to access login page
  if (user.value && isPublicRoute) {
    const roleName = user.value?.role?.name?.toLowerCase()
    if (roleName === 'changelogs') {
      return navigateTo('/iglooworks/changelogs')
    }
    return navigateTo('/')
  }

  // RBAC rules for authenticated users
  if (user.value && !isPublicRoute) {
    const roleName = user.value?.role?.name?.toLowerCase()
    
    // Rules for 'changelogs' role
    if (roleName === 'changelogs') {
      const isAllowedRoute = to.path.startsWith('/iglooworks/changelogs') || to.path === '/settings'
      
      if (!isAllowedRoute) {
        return navigateTo('/iglooworks/changelogs')
      }
    }
  }
})
