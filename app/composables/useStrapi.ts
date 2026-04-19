import type { ContentType, StrapiEntry, CategoryEntry, ChangelogEntry, FaqEntry, IgwChangelogEntry, IgwChangelogDtlEntry } from '~/types/translations'

const GET_LOCALES = `
  query Locales {
    i18NLocales(pagination: { pageSize: 1000 }) {
      data {
        attributes {
          code
          name
        }
      }
    }
  }
`

const GET_CATEGORIES = `
  query Categories($pagination: PaginationArg, $filters: IgloohomeFaqCategoryFiltersInput) {
    igloohomeFaqCategories(
      locale: "en"
      pagination: $pagination
      publicationState: PREVIEW
      filters: $filters
    ) {
      data {
        id
        attributes {
          Name
        }
      }
    }
  }
`

const GET_CHANGELOGS = `
  query Changelogs($pagination: PaginationArg, $filters: IgloohomeChangelogFiltersInput) {
    igloohomeChangelogs(
      locale: "en"
      sort: "ReleaseDate:asc"
      pagination: $pagination
      publicationState: PREVIEW
      filters: $filters
    ) {
      data {
        id
        attributes {
          AppVersion
          ReleaseDate
          Changes
        }
      }
    }
  }
`

const GET_FAQS = `
  query Faqs($pagination: PaginationArg, $filters: IgloohomeFaqFiltersInput) {
    igloohomeFaqs(
      locale: "en"
      sort: "Category.id:asc"
      pagination: $pagination
      publicationState: PREVIEW
      filters: $filters
    ) {
      data {
        id
        attributes {
          Title
          Content
          Category {
            data {
              id
            }
          }
        }
      }
    }
  }
`

const GET_CHANGELOG_TAGS = `
  query ChangelogTags {
    changelogTags(publicationState: PREVIEW, pagination: { pageSize: 1000 }) {
      data {
        id
        attributes {
          Tags
        }
      }
    }
  }
`

const GET_IGW_CHANGELOGS = `
  query IgwChangelogs($pagination: PaginationArg, $filters: IgwChangelogFiltersInput) {
    igwChangelogs(
      pagination: $pagination
      publicationState: PREVIEW
      filters: $filters
      sort: "ReleaseDate:asc"
    ) {
      data {
        id
        attributes {
          Version
          ReleaseDate
          publishedAt
          igw_changelog_dtls(pagination: { pageSize: 1000 }) {
            data {
              id
              attributes {
                Title
                Changes
                locale
                changelog_tags(pagination: { pageSize: 100 }) {
                  data {
                    id
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`

const GET_CATEGORY_BY_ID = `
  query Category($id: ID) {
    igloohomeFaqCategory(id: $id) {
      data {
        id
        attributes {
          localizations(pagination: { pageSize: 1000 }) {
            data {
              id
              attributes {
                locale
              }
            }
          }
        }
      }
    }
  }
`

const GET_CHANGELOG_BY_ID = `
  query Changelog($id: ID) {
    igloohomeChangelog(id: $id) {
      data {
        id
        attributes {
          AppVersion
          ReleaseDate
          Changes
          localizations(pagination: { pageSize: 1000 }) {
            data {
              id
              attributes {
                locale
              }
            }
          }
        }
      }
    }
  }
`

const GET_FAQ_BY_ID = `
  query Faq($id: ID) {
    igloohomeFaq(id: $id) {
      data {
        id
        attributes {
          localizations(pagination: { pageSize: 1000 }) {
            data {
              id
              attributes {
                locale
              }
            }
          }
        }
      }
    }
  }
`

const GET_IGW_CHANGELOG_DTL_BY_ID = `
  query IgwChangelogDtl($id: ID) {
    igwChangelogDtl(id: $id) {
      data {
        id
        attributes {
          Title
          Changes
          localizations(pagination: { pageSize: 1000 }) {
            data {
              id
              attributes {
                locale
              }
            }
          }
        }
      }
    }
  }
`

const SUBMIT_CATEGORY = `
  mutation CreateIgloohomeFaqCategoryLocalization($locale: I18NLocaleCode, $id: ID, $data: IgloohomeFaqCategoryInput) {
    createIgloohomeFaqCategoryLocalization(locale: $locale, id: $id, data: $data) {
      data { id }
    }
  }
`

const UPDATE_CATEGORY = `
  mutation UpdateCategory($id: ID!, $data: IgloohomeFaqCategoryInput!) {
    updateIgloohomeFaqCategory(id: $id, data: $data) {
      data { id }
    }
  }
`

const SUBMIT_CHANGELOG = `
  mutation CreateIgloohomeChangelogLocalization($locale: I18NLocaleCode, $id: ID, $data: IgloohomeChangelogInput) {
    createIgloohomeChangelogLocalization(locale: $locale, id: $id, data: $data) {
      data { id }
    }
  }
`

const UPDATE_CHANGELOG = `
  mutation UpdateChangelog($id: ID!, $data: IgloohomeChangelogInput!) {
    updateIgloohomeChangelog(id: $id, data: $data) {
      data { id }
    }
  }
`

const SUBMIT_FAQ = `
  mutation CreateIgloohomeFaqLocalization($locale: I18NLocaleCode, $id: ID, $data: IgloohomeFaqInput) {
    createIgloohomeFaqLocalization(locale: $locale, id: $id, data: $data) {
      data { id }
    }
  }
`

const UPDATE_FAQ = `
  mutation UpdateIgloohomeFaq($id: ID!, $data: IgloohomeFaqInput!) {
    updateIgloohomeFaq(id: $id, data: $data) {
      data { id }
    }
  }
`

const SUBMIT_IGW_CHANGELOG_DTL = `
  mutation CreateIgwChangelogDtlLocalization($locale: I18NLocaleCode, $id: ID, $data: IgwChangelogDtlInput) {
    createIgwChangelogDtlLocalization(locale: $locale, id: $id, data: $data) {
      data { id }
    }
  }
`

const UPDATE_IGW_CHANGELOG_DTL = `
  mutation UpdateIgwChangelogDtl($id: ID!, $data: IgwChangelogDtlInput!, $locale: I18NLocaleCode) {
    updateIgwChangelogDtl(id: $id, data: $data, locale: $locale) {
      data { id }
    }
  }
`

const CREATE_IGW_CHANGELOG_DTL = `
  mutation CreateIgwChangelogDtl($data: IgwChangelogDtlInput!, $locale: I18NLocaleCode) {
    createIgwChangelogDtl(data: $data, locale: $locale) {
      data { id }
    }
  }
`

const CREATE_IGW_CHANGELOG = `
  mutation CreateIgwChangelog($data: IgwChangelogInput!) {
    createIgwChangelog(data: $data) {
      data { id }
    }
  }
`

const UPDATE_IGW_CHANGELOG = `
  mutation UpdateIgwChangelog($id: ID!, $data: IgwChangelogInput!) {
    updateIgwChangelog(id: $id, data: $data) {
      data { id }
    }
  }
`

const DELETE_IGW_CHANGELOG = `
  mutation DeleteIgwChangelog($id: ID!) {
    deleteIgwChangelog(id: $id) {
      data { id }
    }
  }
`

const DELETE_IGW_CHANGELOG_DTL = `
  mutation DeleteIgwChangelogDtl($id: ID!) {
    deleteIgwChangelogDtl(id: $id) {
      data { id }
    }
  }
`

export const useStrapi = () => {
  const queryMap = {
    categories: {
      all: GET_CATEGORIES,
      byId: GET_CATEGORY_BY_ID,
      submit: SUBMIT_CATEGORY,
      update: UPDATE_CATEGORY,
      key: 'igloohomeFaqCategories',
      singleKey: 'igloohomeFaqCategory'
    },
    changelogs: {
      all: GET_CHANGELOGS,
      byId: GET_CHANGELOG_BY_ID,
      submit: SUBMIT_CHANGELOG,
      update: UPDATE_CHANGELOG,
      key: 'igloohomeChangelogs',
      singleKey: 'igloohomeChangelog'
    },
    faqs: {
      all: GET_FAQS,
      byId: GET_FAQ_BY_ID,
      submit: SUBMIT_FAQ,
      update: UPDATE_FAQ,
      key: 'igloohomeFaqs',
      singleKey: 'igloohomeFaq'
    }
  } as const

  interface StrapiLocalesResponse {
    i18NLocales: {
      data: Array<{
        attributes: {
          code: string
          name: string
        }
      }>
    }
  }

  interface IgwChangelogsResponse {
    igwChangelogs: {
      data: Array<{
        id: string | number
        attributes: {
          Version: string
          ReleaseDate: string
          publishedAt: string
          igw_changelog_dtls?: {
            data: Array<{
              id: string | number
              attributes: {
                Title: string
                Changes: string
                locale: string
              }
            }>
          }
        }
      }>
    }
  }

  interface GenericStrapiResponse {
    [key: string]: {
      data: any | any[]
    }
  }

  const graphqlFetch = async <T>(query: string, variables: Record<string, unknown> = {}): Promise<T> => {
    const response = await $fetch<{ data: T, errors?: { message: string }[] }>('/api/strapi', {
      method: 'POST',
      body: {
        query,
        variables
      }
    })

    if (response.errors && response.errors.length > 0) {
      response.errors.forEach(err => {
        console.error('[GraphQL Error]:', err.message, err)
      })
      throw new Error(response.errors[0]?.message || 'GraphQL Error')
    }

    return response.data
  }

  const getLocales = async (): Promise<{ code: string; name: string }[]> => {
    const data = await graphqlFetch<StrapiLocalesResponse>(GET_LOCALES)
    return data.i18NLocales.data.map((item) => ({
      code: item.attributes.code,
      name: item.attributes.name
    }))
  }

  const getIgwChangelogs = async (unpublishedOnly = false): Promise<{ parents: IgwChangelogEntry[]; dtls: IgwChangelogDtlEntry[] }> => {
    const variables: Record<string, unknown> = { pagination: { pageSize: 1000 } }
    if (unpublishedOnly) {
      variables.filters = { publishedAt: { eq: null } }
    }
    const data = await graphqlFetch<IgwChangelogsResponse>(GET_IGW_CHANGELOGS, variables)
    const parents: IgwChangelogEntry[] = []
    const dtls: IgwChangelogDtlEntry[] = []

    data.igwChangelogs.data.forEach((item) => {
      const { id, attributes } = item
      const allDtls = attributes.igw_changelog_dtls?.data || []
      
      const localeCounts: Record<string, number> = {}
      const localesSet = new Set<string>()

      allDtls.forEach((dtl) => {
        const loc = dtl.attributes.locale || 'en'
        localesSet.add(loc)
        localeCounts[loc] = (localeCounts[loc] || 0) + 1
      })

      parents.push({
        id: id.toString(),
        version: attributes.Version,
        releaseDate: attributes.ReleaseDate,
        publishedAt: attributes.publishedAt,
        locales: Array.from(localesSet),
        localeCounts
      })

      // Source entries for workflow must be 'en'
      const baseDtls = allDtls.filter((d) => (d.attributes.locale || 'en') === 'en')

      baseDtls.forEach((dtl) => {
        dtls.push({
          id: dtl.id.toString(),
          title: dtl.attributes.Title,
          content: dtl.attributes.Changes,
          parentId: id.toString(),
          tagIds: (dtl.attributes.changelog_tags?.data || []).map((t: any) => t.id.toString())
        })
      })
    })

    return { parents, dtls }
  }

  const createIgwChangelog = async (data: any): Promise<any> => {
    return await graphqlFetch(CREATE_IGW_CHANGELOG, { data })
  }

  const updateIgwChangelog = async (id: string, data: any): Promise<any> => {
    return await graphqlFetch(UPDATE_IGW_CHANGELOG, { id, data })
  }

  const deleteIgwChangelog = async (id: string): Promise<any> => {
    // 1. Fetch to get children IDs for cascade delete
    const data = await graphqlFetch<any>(`
      query IgwChangelog($id: ID) {
        igwChangelog(id: $id) {
          data {
            attributes {
              igw_changelog_dtls(pagination: { pageSize: 1000 }) {
                data { id }
              }
            }
          }
        }
      }
    `, { id })

    const dtlIds = data.igwChangelog?.data?.attributes?.igw_changelog_dtls?.data?.map((d: any) => d.id) || []

    // 2. Delete children first
    for (const dtlId of dtlIds) {
      await graphqlFetch(DELETE_IGW_CHANGELOG_DTL, { id: dtlId })
    }

    // 3. Delete parent
    return await graphqlFetch(DELETE_IGW_CHANGELOG, { id })
  }

  const publishIgwChangelog = async (id: string, publish: boolean): Promise<void> => {
    const publishedAt = publish ? new Date().toISOString() : null
    
    // 1. Publish/Unpublish parent
    await graphqlFetch(UPDATE_IGW_CHANGELOG, { 
      id, 
      data: { publishedAt } 
    })

    // 2. Publish/Unpublish children (dtls)
    const data = await graphqlFetch<any>(`
      query IgwChangelog($id: ID) {
        igwChangelog(id: $id) {
          data {
            attributes {
              igw_changelog_dtls(pagination: { pageSize: 1000 }) {
                data { id }
              }
            }
          }
        }
      }
    `, { id })

    const dtlIds = data.igwChangelog?.data?.attributes?.igw_changelog_dtls?.data?.map((d: any) => d.id) || []
    
    for (const dtlId of dtlIds) {
      await graphqlFetch(UPDATE_IGW_CHANGELOG_DTL, { 
        id: dtlId, 
        data: { publishedAt } 
      })
    }
  }

  const getChangelogTags = async (): Promise<{ id: string; name: string }[]> => {
    const data = await graphqlFetch<any>(GET_CHANGELOG_TAGS)
    return (data.changelogTags?.data || []).map((t: any) => ({
      id: t.id.toString(),
      name: t.attributes.Tags
    }))
  }

  const getIgwChangelogDtls = async (parentId: string, locale: string): Promise<IgwChangelogDtlEntry[]> => {
    const query = `
      query IgwChangelogDtls($parentId: ID, $locale: String) {
        igwChangelog(id: $parentId) {
          data {
            id
            attributes {
              igw_changelog_dtls(filters: { locale: { eq: $locale } }, pagination: { pageSize: 1000 }) {
                data {
                  id
                  attributes {
                    Title
                    Changes
                    locale
                    changelog_tags(pagination: { pageSize: 100 }) {
                      data {
                        id
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `
    const data = await graphqlFetch<any>(query, { parentId, locale })
    const dtls = data.igwChangelog?.data?.attributes?.igw_changelog_dtls?.data || []

    return dtls.map((d: any) => ({
      id: d.id.toString(),
      title: d.attributes.Title,
      content: d.attributes.Changes,
      parentId: parentId,
      tagIds: (d.attributes.changelog_tags?.data || []).map((t: any) => t.id.toString())
    })) as IgwChangelogDtlEntry[]
  }

  const fetchCollection = async (type: ContentType, unpublishedOnly = false): Promise<StrapiEntry[]> => {
    const qConfig = queryMap[type as keyof typeof queryMap]
    if (!qConfig) {
      throw new Error(`Content type ${type} is not supported in fetchCollection`)
    }

    const variables: Record<string, unknown> = { pagination: { pageSize: 1000 } }
    
    if (unpublishedOnly) {
      variables.filters = { publishedAt: { eq: null } }
    }
    
    const data = await graphqlFetch<GenericStrapiResponse>(qConfig.all, variables)
    const items = data[qConfig.key]?.data || []

    return items.map((item: any) => {
      const { id, attributes } = item
      if (type === 'categories') {
        return {
          id: id.toString(),
          category: attributes.Name
        } as CategoryEntry
      } else if (type === 'changelogs') {
        return {
          id: id.toString(),
          appVersion: attributes.AppVersion,
          releaseDate: attributes.ReleaseDate,
          changes: attributes.Changes
        } as ChangelogEntry
      } else { // faqs
        return {
          id: id.toString(),
          title: attributes.Title,
          content: attributes.Content,
          category: attributes.Category?.data?.id?.toString() || ''
        } as FaqEntry
      }
    })
  }

  const extractTranslatableFields = (type: ContentType, entries: StrapiEntry[]): string[] => {
    const values: string[] = []
    entries.forEach(entry => {
      if (type === 'categories') {
        values.push((entry as CategoryEntry).category)
      } else if (type === 'changelogs') {
        values.push((entry as ChangelogEntry).changes)
      } else if (type === 'faqs') {
        const faq = entry as FaqEntry
        values.push(faq.title)
        values.push(faq.content)
      }
    })
    return values
  }

  const mergeTranslations = (
    type: ContentType,
    sourceEntries: StrapiEntry[],
    translatedValues: string[]
  ): StrapiEntry[] => {
    let valueIndex = 0
    return sourceEntries.map(entry => {
      const newEntry = { ...entry }
      if (type === 'categories') {
        (newEntry as CategoryEntry).category = translatedValues[valueIndex++] || ''
      } else if (type === 'changelogs') {
        (newEntry as ChangelogEntry).changes = translatedValues[valueIndex++] || ''
      } else if (type === 'faqs') {
        (newEntry as FaqEntry).title = translatedValues[valueIndex++] || ''
        ;(newEntry as FaqEntry).content = translatedValues[valueIndex++] || ''
      }
      return newEntry
    })
  }

  const pushLocaleToStrapi = async (
    type: ContentType,
    locale: string,
    translatedEntries: StrapiEntry[]
  ): Promise<{ synced: number; failed: number; errors: string[] }> => {
    let synced = 0
    let failed = 0
    const errors: string[] = []
    const qConfig = queryMap[type as keyof typeof queryMap]
    if (!qConfig) {
      throw new Error(`Content type ${type} is not supported in pushLocaleToStrapi`)
    }

    // Cache for category lookups to optimize FAQ sync
    const categoryCache: Record<string, string> = {}
    
    // Concurrency limit for batch processing
    const CONCURRENCY_LIMIT = 5
    const chunks: StrapiEntry[][] = []
    for (let i = 0; i < translatedEntries.length; i += CONCURRENCY_LIMIT) {
      chunks.push(translatedEntries.slice(i, i + CONCURRENCY_LIMIT))
    }

    for (const chunk of chunks) {
      await Promise.all(chunk.map(async (entry) => {
        try {
          // 1. Fetch source entry by ID with localizations
          const sourceData = await graphqlFetch<GenericStrapiResponse>(qConfig.byId, { id: entry.id })
          const sourceItem = sourceData[qConfig.singleKey]?.data
          
          if (!sourceItem) {
            throw new Error(`Source entry ID ${entry.id} not found in Strapi`)
          }

          const localizations = sourceItem.attributes?.localizations?.data || []
          const existingLoc = localizations.find((loc: any) => loc.attributes?.locale === locale)

          // 2. Prepare data object for mutation
          // IMPORTANT: Use the same case as defined in schema.graphql
          const mutationData: any = { publishedAt: new Date().toISOString() }
          
          if (type === 'categories') {
            mutationData.Name = (entry as CategoryEntry).category
          } else if (type === 'changelogs') {
            const changelog = entry as ChangelogEntry
            mutationData.AppVersion = changelog.appVersion
            mutationData.Changes = changelog.changes
            // Ensure ReleaseDate is valid or null
            mutationData.ReleaseDate = changelog.releaseDate || null
          } else if (type === 'faqs') {
            const faq = entry as FaqEntry
            mutationData.Title = faq.title
            mutationData.Content = faq.content
            
            // Map source category ID to localized category ID if available
            if (faq.category) {
              if (!categoryCache[faq.category]) {
                const catData = await graphqlFetch<any>(queryMap.categories.byId, { id: faq.category })
                const catLocs = catData.igloohomeFaqCategory?.data?.attributes?.localizations?.data || []
                const catLoc = catLocs.find((loc: any) => loc.attributes?.locale === locale)
                categoryCache[faq.category] = catLoc ? catLoc.id : faq.category
              }
              mutationData.Category = categoryCache[faq.category]
            }
          }

        // 3. Update existing localization or create new one
          if (existingLoc) {
            await graphqlFetch(qConfig.update, {
              id: existingLoc.id,
              data: mutationData
            })
          } else {
            await graphqlFetch(qConfig.submit, {
              id: entry.id,
              locale,
              data: mutationData
            })
          }
          
          synced++
        } catch (e: any) {
          failed++
          const msg = `Failed to sync ID ${entry.id}: ${e.message}`
          console.error(msg)
          errors.push(msg)
        }
      }))
    }

    return { synced, failed, errors }
  }

  const testConnection = async (): Promise<boolean> => {
    await graphqlFetch(GET_CATEGORIES, { pagination: { pageSize: 1 } })
    return true
  }

  return {
    fetchCollection,
    getIgwChangelogs,
    getIgwChangelogDtls,
    getChangelogTags,
    createIgwChangelog,
    updateIgwChangelog,
    deleteIgwChangelog,
    publishIgwChangelog,
    deleteIgwChangelogDtl: async (id: string) => graphqlFetch(DELETE_IGW_CHANGELOG_DTL, { id }),
    createIgwChangelogDtl: async (data: any, locale?: string) => graphqlFetch(CREATE_IGW_CHANGELOG_DTL, { data, locale }),
    updateIgwChangelogDtl: async (id: string, data: any, locale?: string) => graphqlFetch(UPDATE_IGW_CHANGELOG_DTL, { id, data, locale }),
    submitIgwChangelogDtl: async (id: string, locale: string, data: any) => graphqlFetch(SUBMIT_IGW_CHANGELOG_DTL, { id, locale, data }),
    extractTranslatableFields,
    mergeTranslations,
    pushLocaleToStrapi,
    testConnection,
    getLocales,
    graphqlFetch
  }
}
