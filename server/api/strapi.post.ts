export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  return await $fetch(`${config.strapiBaseUrl}/graphql`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.strapiApiToken}`
    },
    body
  })
})
