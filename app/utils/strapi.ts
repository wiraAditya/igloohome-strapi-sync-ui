import type {
  CategoryEntry,
  ChangelogEntry,
  FaqEntry,
  IgwChangelogEntry,
  IgwChangelogDtlEntry,
  StrapiEntry
} from '~/types/translations'

/**
 * Type guard for CategoryEntry
 */
export const asCategory = (entry: StrapiEntry): CategoryEntry => entry as CategoryEntry

/**
 * Type guard for ChangelogEntry
 */
export const asChangelog = (entry: StrapiEntry): ChangelogEntry => entry as ChangelogEntry

/**
 * Type guard for FaqEntry
 */
export const asFaq = (entry: StrapiEntry): FaqEntry => entry as FaqEntry

/**
 * Type guard for IgwChangelogEntry (Parent)
 */
export const asIgwChangelog = (entry: StrapiEntry): IgwChangelogEntry => entry as IgwChangelogEntry

/**
 * Type guard for IgwChangelogDtlEntry (Localized Detail)
 */
export const asIgwChangelogDtl = (entry: StrapiEntry): IgwChangelogDtlEntry => entry as IgwChangelogDtlEntry

/**
 * Safely extracts the ID from a StrapiEntry
 */
export const getEntryId = (entry: StrapiEntry): string => entry.id
