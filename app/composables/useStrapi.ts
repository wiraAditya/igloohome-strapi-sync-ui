import type { ContentType, StrapiEntry, CategoryEntry, ChangelogEntry, FaqEntry } from '~/types/translations'

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

  const graphqlFetch = async <T = any>(query: string, variables: Record<string, any> = {}): Promise<T> => {
    // SECURE: Now calling local Nitro proxy instead of direct Strapi
    const response = await $fetch<{ data: T, errors?: any[] }>('/api/strapi', {
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

  const fetchCollection = async (type: ContentType, unpublishedOnly = false): Promise<StrapiEntry[]> => {
    const qConfig = queryMap[type]
    const variables: any = { pagination: { pageSize: 1000 } }
    
    if (unpublishedOnly) {
      variables.filters = { publishedAt: { eq: null } }
    }
    
    const data = await graphqlFetch(qConfig.all, variables)
    const items = data[qConfig.key].data

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
  ) => {
    let synced = 0
    let failed = 0
    const errors: string[] = []
    const qConfig = queryMap[type]

    // Cache for category lookups to optimize FAQ sync
    const categoryCache: Record<string, string> = {}

    for (const entry of translatedEntries) {
      try {
        // 1. Fetch source entry by ID with localizations
        const sourceData = await graphqlFetch(qConfig.byId, { id: entry.id })
        const sourceItem = sourceData[qConfig.singleKey].data
        
        if (!sourceItem) {
          throw new Error(`Source entry ID ${entry.id} not found`)
        }

        const localizations = sourceItem.attributes?.localizations?.data || []
        const existingLoc = localizations.find((loc: any) => loc.attributes?.locale === locale)

        // 2. Prepare data object for mutation
        const mutationData: any = { publishedAt: new Date().toISOString() }
        
        if (type === 'categories') {
          mutationData.Name = (entry as CategoryEntry).category
        } else if (type === 'changelogs') {
          mutationData.AppVersion = (entry as ChangelogEntry).appVersion
          mutationData.Changes = (entry as ChangelogEntry).changes
          mutationData.ReleaseDate = (entry as ChangelogEntry).releaseDate
        } else if (type === 'faqs') {
          const faq = entry as FaqEntry
          mutationData.Title = faq.title
          mutationData.Content = faq.content
          
          // Map source category ID to localized category ID if available
          if (faq.category) {
            if (!categoryCache[faq.category]) {
              const catData = await graphqlFetch(queryMap.categories.byId, { id: faq.category })
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
        errors.push(`Failed to sync ID ${entry.id}: ${e.message}`)
      }
    }

    return { synced, failed, errors }
  }

  const testConnection = async () => {
    await graphqlFetch(GET_CATEGORIES, { pagination: { pageSize: 1 } })
    return true
  }

  return {
    fetchCollection,
    extractTranslatableFields,
    mergeTranslations,
    pushLocaleToStrapi,
    testConnection
  }
}
