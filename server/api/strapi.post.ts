export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  // Extract user JWT from cookie (httpOnly)
  const userJwt = getCookie(event, 'strapi_jwt')
  
  if (!userJwt) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication required: Missing user JWT'
    })
  }

  try {
    return await $fetch(`${config.strapiBaseUrl}/graphql`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userJwt.replace(/[\n\r]/g, '')}`,
        'Content-Type': 'application/json'
      },
      body
    })
  } catch (error: any) {
    throw createError({
      statusCode: error?.response?.status || 500,
      statusMessage: error?.data?.error?.message || 'Strapi Proxy Error',
      data: error?.data
    })
  }
})
