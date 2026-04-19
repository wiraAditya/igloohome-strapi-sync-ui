export default defineEventHandler((event) => {
  deleteCookie(event, 'strapi_jwt')
  deleteCookie(event, 'strapi_user')
  
  return { success: true }
})
