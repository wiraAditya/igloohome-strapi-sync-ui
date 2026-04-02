/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
  DateTime: { input: any; output: any; }
  I18NLocaleCode: { input: any; output: any; }
  JSON: { input: any; output: any; }
  Upload: { input: any; output: any; }
};

export type BooleanFilterInput = {
  and?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  between?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  contains?: InputMaybe<Scalars['Boolean']['input']>;
  containsi?: InputMaybe<Scalars['Boolean']['input']>;
  endsWith?: InputMaybe<Scalars['Boolean']['input']>;
  eq?: InputMaybe<Scalars['Boolean']['input']>;
  eqi?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['Boolean']['input']>;
  gte?: InputMaybe<Scalars['Boolean']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  lt?: InputMaybe<Scalars['Boolean']['input']>;
  lte?: InputMaybe<Scalars['Boolean']['input']>;
  ne?: InputMaybe<Scalars['Boolean']['input']>;
  nei?: InputMaybe<Scalars['Boolean']['input']>;
  not?: InputMaybe<BooleanFilterInput>;
  notContains?: InputMaybe<Scalars['Boolean']['input']>;
  notContainsi?: InputMaybe<Scalars['Boolean']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  notNull?: InputMaybe<Scalars['Boolean']['input']>;
  null?: InputMaybe<Scalars['Boolean']['input']>;
  or?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  startsWith?: InputMaybe<Scalars['Boolean']['input']>;
};

export enum CategoryType {
  AccessControl = 'ACCESS_CONTROL',
  AssistedLiving = 'ASSISTED_LIVING',
  HospitalityManagement = 'HOSPITALITY_MANAGEMENT',
  PropertyManagement = 'PROPERTY_MANAGEMENT',
  RealEstate = 'REAL_ESTATE',
  SharingEconomy = 'SHARING_ECONOMY',
  TenantExperience = 'TENANT_EXPERIENCE',
  VacationRental = 'VACATION_RENTAL'
}

export type CfLockModuleType = {
  __typename?: 'CfLockModuleType';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  featureRefs?: Maybe<SkuFeatureRelationResponseCollection>;
  moduleType: Scalars['String']['output'];
  protocolMajorVersion?: Maybe<Scalars['Int']['output']>;
  protocolMinorVersion?: Maybe<Scalars['Int']['output']>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};


export type CfLockModuleTypeFeatureRefsArgs = {
  filters?: InputMaybe<SkuFeatureFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type CfLockModuleTypeEntity = {
  __typename?: 'CfLockModuleTypeEntity';
  attributes?: Maybe<CfLockModuleType>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type CfLockModuleTypeEntityResponse = {
  __typename?: 'CfLockModuleTypeEntityResponse';
  data?: Maybe<CfLockModuleTypeEntity>;
};

export type CfLockModuleTypeEntityResponseCollection = {
  __typename?: 'CfLockModuleTypeEntityResponseCollection';
  data: Array<CfLockModuleTypeEntity>;
  meta: ResponseCollectionMeta;
};

export type CfLockModuleTypeFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<CfLockModuleTypeFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  featureRefs?: InputMaybe<SkuFeatureFiltersInput>;
  id?: InputMaybe<IdFilterInput>;
  moduleType?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<CfLockModuleTypeFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<CfLockModuleTypeFiltersInput>>>;
  protocolMajorVersion?: InputMaybe<IntFilterInput>;
  protocolMinorVersion?: InputMaybe<IntFilterInput>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type CfLockModuleTypeInput = {
  featureRefs?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  moduleType?: InputMaybe<Scalars['String']['input']>;
  protocolMajorVersion?: InputMaybe<Scalars['Int']['input']>;
  protocolMinorVersion?: InputMaybe<Scalars['Int']['input']>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type ChangelogTag = {
  __typename?: 'ChangelogTag';
  Tags?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type ChangelogTagEntity = {
  __typename?: 'ChangelogTagEntity';
  attributes?: Maybe<ChangelogTag>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type ChangelogTagEntityResponse = {
  __typename?: 'ChangelogTagEntityResponse';
  data?: Maybe<ChangelogTagEntity>;
};

export type ChangelogTagEntityResponseCollection = {
  __typename?: 'ChangelogTagEntityResponseCollection';
  data: Array<ChangelogTagEntity>;
  meta: ResponseCollectionMeta;
};

export type ChangelogTagFiltersInput = {
  Tags?: InputMaybe<StringFilterInput>;
  and?: InputMaybe<Array<InputMaybe<ChangelogTagFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  not?: InputMaybe<ChangelogTagFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ChangelogTagFiltersInput>>>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type ChangelogTagInput = {
  Tags?: InputMaybe<Scalars['String']['input']>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type ChangelogTagRelationResponseCollection = {
  __typename?: 'ChangelogTagRelationResponseCollection';
  data: Array<ChangelogTagEntity>;
};

export type ConfigTranslation = {
  __typename?: 'ConfigTranslation';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  key: Scalars['String']['output'];
  locale?: Maybe<Scalars['String']['output']>;
  localizations?: Maybe<ConfigTranslationRelationResponseCollection>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  text: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};


export type ConfigTranslationLocalizationsArgs = {
  filters?: InputMaybe<ConfigTranslationFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ConfigTranslationEntity = {
  __typename?: 'ConfigTranslationEntity';
  attributes?: Maybe<ConfigTranslation>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type ConfigTranslationEntityResponse = {
  __typename?: 'ConfigTranslationEntityResponse';
  data?: Maybe<ConfigTranslationEntity>;
};

export type ConfigTranslationEntityResponseCollection = {
  __typename?: 'ConfigTranslationEntityResponseCollection';
  data: Array<ConfigTranslationEntity>;
  meta: ResponseCollectionMeta;
};

export type ConfigTranslationFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ConfigTranslationFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  key?: InputMaybe<StringFilterInput>;
  locale?: InputMaybe<StringFilterInput>;
  localizations?: InputMaybe<ConfigTranslationFiltersInput>;
  not?: InputMaybe<ConfigTranslationFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ConfigTranslationFiltersInput>>>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  text?: InputMaybe<StringFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type ConfigTranslationInput = {
  key?: InputMaybe<Scalars['String']['input']>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
};

export type ConfigTranslationRelationResponseCollection = {
  __typename?: 'ConfigTranslationRelationResponseCollection';
  data: Array<ConfigTranslationEntity>;
};

export type DateFilterInput = {
  and?: InputMaybe<Array<InputMaybe<Scalars['Date']['input']>>>;
  between?: InputMaybe<Array<InputMaybe<Scalars['Date']['input']>>>;
  contains?: InputMaybe<Scalars['Date']['input']>;
  containsi?: InputMaybe<Scalars['Date']['input']>;
  endsWith?: InputMaybe<Scalars['Date']['input']>;
  eq?: InputMaybe<Scalars['Date']['input']>;
  eqi?: InputMaybe<Scalars['Date']['input']>;
  gt?: InputMaybe<Scalars['Date']['input']>;
  gte?: InputMaybe<Scalars['Date']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Date']['input']>>>;
  lt?: InputMaybe<Scalars['Date']['input']>;
  lte?: InputMaybe<Scalars['Date']['input']>;
  ne?: InputMaybe<Scalars['Date']['input']>;
  nei?: InputMaybe<Scalars['Date']['input']>;
  not?: InputMaybe<DateFilterInput>;
  notContains?: InputMaybe<Scalars['Date']['input']>;
  notContainsi?: InputMaybe<Scalars['Date']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Date']['input']>>>;
  notNull?: InputMaybe<Scalars['Boolean']['input']>;
  null?: InputMaybe<Scalars['Boolean']['input']>;
  or?: InputMaybe<Array<InputMaybe<Scalars['Date']['input']>>>;
  startsWith?: InputMaybe<Scalars['Date']['input']>;
};

export type DateTimeFilterInput = {
  and?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  between?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  contains?: InputMaybe<Scalars['DateTime']['input']>;
  containsi?: InputMaybe<Scalars['DateTime']['input']>;
  endsWith?: InputMaybe<Scalars['DateTime']['input']>;
  eq?: InputMaybe<Scalars['DateTime']['input']>;
  eqi?: InputMaybe<Scalars['DateTime']['input']>;
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  gte?: InputMaybe<Scalars['DateTime']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  lte?: InputMaybe<Scalars['DateTime']['input']>;
  ne?: InputMaybe<Scalars['DateTime']['input']>;
  nei?: InputMaybe<Scalars['DateTime']['input']>;
  not?: InputMaybe<DateTimeFilterInput>;
  notContains?: InputMaybe<Scalars['DateTime']['input']>;
  notContainsi?: InputMaybe<Scalars['DateTime']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  notNull?: InputMaybe<Scalars['Boolean']['input']>;
  null?: InputMaybe<Scalars['Boolean']['input']>;
  or?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  startsWith?: InputMaybe<Scalars['DateTime']['input']>;
};

export type DescLang = {
  __typename?: 'DescLang';
  desc?: Maybe<Scalars['String']['output']>;
  lang?: Maybe<Scalars['String']['output']>;
};

export enum Enum_Ighmanifest_Kind {
  Feature = 'feature',
  I18n = 'i18n',
  LockModuleType = 'lock_module_type',
  ManualPairing = 'manual_pairing',
  PrivacyPolicy = 'privacy_policy',
  RemoteConfig = 'remote_config',
  Sku = 'sku'
}

export enum Enum_Manualpairingcategory_Category {
  AccessManagement = 'access_management',
  DoorAndGates = 'door_and_gates',
  EcosystemDevices = 'ecosystem_devices',
  Reader = 'reader'
}

export type FileInfoInput = {
  alternativeText?: InputMaybe<Scalars['String']['input']>;
  caption?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type FloatFilterInput = {
  and?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  between?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  contains?: InputMaybe<Scalars['Float']['input']>;
  containsi?: InputMaybe<Scalars['Float']['input']>;
  endsWith?: InputMaybe<Scalars['Float']['input']>;
  eq?: InputMaybe<Scalars['Float']['input']>;
  eqi?: InputMaybe<Scalars['Float']['input']>;
  gt?: InputMaybe<Scalars['Float']['input']>;
  gte?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  lt?: InputMaybe<Scalars['Float']['input']>;
  lte?: InputMaybe<Scalars['Float']['input']>;
  ne?: InputMaybe<Scalars['Float']['input']>;
  nei?: InputMaybe<Scalars['Float']['input']>;
  not?: InputMaybe<FloatFilterInput>;
  notContains?: InputMaybe<Scalars['Float']['input']>;
  notContainsi?: InputMaybe<Scalars['Float']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  notNull?: InputMaybe<Scalars['Boolean']['input']>;
  null?: InputMaybe<Scalars['Boolean']['input']>;
  or?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  startsWith?: InputMaybe<Scalars['Float']['input']>;
};

export type GenericMorph = CfLockModuleType | ChangelogTag | ConfigTranslation | I18NLocale | IghAirbnbTemplates | IghManifest | IghRemoteConfig | IghScBannerStyle | IghShowcaseBanner | IghSkuConfig | IgloohomeChangelog | IgloohomeFaq | IgloohomeFaqCategory | IgloohomeHighlightedServiceBanner | IgwChangelog | IgwChangelogDtl | ManualPairingCategory | PrivacyPolicy | Sku | SkuFeature | StripeSyncStripeDesc | UploadFile | UploadFolder | UsersPermissionsPermission | UsersPermissionsRole | UsersPermissionsUser;

export type I18NLocale = {
  __typename?: 'I18NLocale';
  code?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type I18NLocaleEntity = {
  __typename?: 'I18NLocaleEntity';
  attributes?: Maybe<I18NLocale>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type I18NLocaleEntityResponse = {
  __typename?: 'I18NLocaleEntityResponse';
  data?: Maybe<I18NLocaleEntity>;
};

export type I18NLocaleEntityResponseCollection = {
  __typename?: 'I18NLocaleEntityResponseCollection';
  data: Array<I18NLocaleEntity>;
  meta: ResponseCollectionMeta;
};

export type I18NLocaleFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<I18NLocaleFiltersInput>>>;
  code?: InputMaybe<StringFilterInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<I18NLocaleFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<I18NLocaleFiltersInput>>>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type IdFilterInput = {
  and?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  between?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  contains?: InputMaybe<Scalars['ID']['input']>;
  containsi?: InputMaybe<Scalars['ID']['input']>;
  endsWith?: InputMaybe<Scalars['ID']['input']>;
  eq?: InputMaybe<Scalars['ID']['input']>;
  eqi?: InputMaybe<Scalars['ID']['input']>;
  gt?: InputMaybe<Scalars['ID']['input']>;
  gte?: InputMaybe<Scalars['ID']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  lt?: InputMaybe<Scalars['ID']['input']>;
  lte?: InputMaybe<Scalars['ID']['input']>;
  ne?: InputMaybe<Scalars['ID']['input']>;
  nei?: InputMaybe<Scalars['ID']['input']>;
  not?: InputMaybe<IdFilterInput>;
  notContains?: InputMaybe<Scalars['ID']['input']>;
  notContainsi?: InputMaybe<Scalars['ID']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  notNull?: InputMaybe<Scalars['Boolean']['input']>;
  null?: InputMaybe<Scalars['Boolean']['input']>;
  or?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  startsWith?: InputMaybe<Scalars['ID']['input']>;
};

export type IghAirbnbTemplates = {
  __typename?: 'IghAirbnbTemplates';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  locale?: Maybe<Scalars['String']['output']>;
  localizations?: Maybe<IghAirbnbTemplatesRelationResponseCollection>;
  message?: Maybe<Scalars['String']['output']>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};


export type IghAirbnbTemplatesLocalizationsArgs = {
  publicationState?: InputMaybe<PublicationState>;
};

export type IghAirbnbTemplatesEntity = {
  __typename?: 'IghAirbnbTemplatesEntity';
  attributes?: Maybe<IghAirbnbTemplates>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type IghAirbnbTemplatesEntityResponse = {
  __typename?: 'IghAirbnbTemplatesEntityResponse';
  data?: Maybe<IghAirbnbTemplatesEntity>;
};

export type IghAirbnbTemplatesInput = {
  message?: InputMaybe<Scalars['String']['input']>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type IghAirbnbTemplatesRelationResponseCollection = {
  __typename?: 'IghAirbnbTemplatesRelationResponseCollection';
  data: Array<IghAirbnbTemplatesEntity>;
};

export type IghManifest = {
  __typename?: 'IghManifest';
  active?: Maybe<Scalars['Boolean']['output']>;
  checksum: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  filename: Scalars['String']['output'];
  jsonContent?: Maybe<Scalars['JSON']['output']>;
  kind: Enum_Ighmanifest_Kind;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  ref?: Maybe<Scalars['Int']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type IghManifestEntity = {
  __typename?: 'IghManifestEntity';
  attributes?: Maybe<IghManifest>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type IghManifestEntityResponse = {
  __typename?: 'IghManifestEntityResponse';
  data?: Maybe<IghManifestEntity>;
};

export type IghManifestEntityResponseCollection = {
  __typename?: 'IghManifestEntityResponseCollection';
  data: Array<IghManifestEntity>;
  meta: ResponseCollectionMeta;
};

export type IghManifestFiltersInput = {
  active?: InputMaybe<BooleanFilterInput>;
  and?: InputMaybe<Array<InputMaybe<IghManifestFiltersInput>>>;
  checksum?: InputMaybe<StringFilterInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  filename?: InputMaybe<StringFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  jsonContent?: InputMaybe<JsonFilterInput>;
  kind?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<IghManifestFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<IghManifestFiltersInput>>>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  ref?: InputMaybe<IntFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type IghManifestInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  checksum?: InputMaybe<Scalars['String']['input']>;
  filename?: InputMaybe<Scalars['String']['input']>;
  jsonContent?: InputMaybe<Scalars['JSON']['input']>;
  kind?: InputMaybe<Enum_Ighmanifest_Kind>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
  ref?: InputMaybe<Scalars['Int']['input']>;
};

export type IghRemoteConfig = {
  __typename?: 'IghRemoteConfig';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  key: Scalars['String']['output'];
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  value: Scalars['JSON']['output'];
  whitelistedUsers?: Maybe<Scalars['JSON']['output']>;
};

export type IghRemoteConfigEntity = {
  __typename?: 'IghRemoteConfigEntity';
  attributes?: Maybe<IghRemoteConfig>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type IghRemoteConfigEntityResponse = {
  __typename?: 'IghRemoteConfigEntityResponse';
  data?: Maybe<IghRemoteConfigEntity>;
};

export type IghRemoteConfigEntityResponseCollection = {
  __typename?: 'IghRemoteConfigEntityResponseCollection';
  data: Array<IghRemoteConfigEntity>;
  meta: ResponseCollectionMeta;
};

export type IghRemoteConfigFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<IghRemoteConfigFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  description?: InputMaybe<StringFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  key?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<IghRemoteConfigFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<IghRemoteConfigFiltersInput>>>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
  value?: InputMaybe<JsonFilterInput>;
  whitelistedUsers?: InputMaybe<JsonFilterInput>;
};

export type IghRemoteConfigInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  key?: InputMaybe<Scalars['String']['input']>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
  value?: InputMaybe<Scalars['JSON']['input']>;
  whitelistedUsers?: InputMaybe<Scalars['JSON']['input']>;
};

export type IghScBannerStyle = {
  __typename?: 'IghScBannerStyle';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  descLeftMarginInPercent?: Maybe<Scalars['Int']['output']>;
  descTopMarginInPercent?: Maybe<Scalars['Int']['output']>;
  descWidthInPercent?: Maybe<Scalars['Int']['output']>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  styleName?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type IghScBannerStyleEntity = {
  __typename?: 'IghScBannerStyleEntity';
  attributes?: Maybe<IghScBannerStyle>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type IghScBannerStyleEntityResponse = {
  __typename?: 'IghScBannerStyleEntityResponse';
  data?: Maybe<IghScBannerStyleEntity>;
};

export type IghScBannerStyleEntityResponseCollection = {
  __typename?: 'IghScBannerStyleEntityResponseCollection';
  data: Array<IghScBannerStyleEntity>;
  meta: ResponseCollectionMeta;
};

export type IghScBannerStyleFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<IghScBannerStyleFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  descLeftMarginInPercent?: InputMaybe<IntFilterInput>;
  descTopMarginInPercent?: InputMaybe<IntFilterInput>;
  descWidthInPercent?: InputMaybe<IntFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  not?: InputMaybe<IghScBannerStyleFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<IghScBannerStyleFiltersInput>>>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  styleName?: InputMaybe<StringFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type IghScBannerStyleInput = {
  descLeftMarginInPercent?: InputMaybe<Scalars['Int']['input']>;
  descTopMarginInPercent?: InputMaybe<Scalars['Int']['input']>;
  descWidthInPercent?: InputMaybe<Scalars['Int']['input']>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
  styleName?: InputMaybe<Scalars['String']['input']>;
};

export type IghShowcaseBanner = {
  __typename?: 'IghShowcaseBanner';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  igh_scb_style?: Maybe<IghScBannerStyleEntityResponse>;
  image?: Maybe<UploadFileEntityResponse>;
  locale?: Maybe<Scalars['String']['output']>;
  localizations?: Maybe<IghShowcaseBannerRelationResponseCollection>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};


export type IghShowcaseBannerLocalizationsArgs = {
  filters?: InputMaybe<IghShowcaseBannerFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type IghShowcaseBannerEntity = {
  __typename?: 'IghShowcaseBannerEntity';
  attributes?: Maybe<IghShowcaseBanner>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type IghShowcaseBannerEntityResponse = {
  __typename?: 'IghShowcaseBannerEntityResponse';
  data?: Maybe<IghShowcaseBannerEntity>;
};

export type IghShowcaseBannerEntityResponseCollection = {
  __typename?: 'IghShowcaseBannerEntityResponseCollection';
  data: Array<IghShowcaseBannerEntity>;
  meta: ResponseCollectionMeta;
};

export type IghShowcaseBannerFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<IghShowcaseBannerFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  description?: InputMaybe<StringFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  igh_scb_style?: InputMaybe<IghScBannerStyleFiltersInput>;
  locale?: InputMaybe<StringFilterInput>;
  localizations?: InputMaybe<IghShowcaseBannerFiltersInput>;
  not?: InputMaybe<IghShowcaseBannerFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<IghShowcaseBannerFiltersInput>>>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type IghShowcaseBannerInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  igh_scb_style?: InputMaybe<Scalars['ID']['input']>;
  image?: InputMaybe<Scalars['ID']['input']>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type IghShowcaseBannerRelationResponseCollection = {
  __typename?: 'IghShowcaseBannerRelationResponseCollection';
  data: Array<IghShowcaseBannerEntity>;
};

export type IghSkuConfig = {
  __typename?: 'IghSkuConfig';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  filtersBtForPairingRegex?: Maybe<Scalars['JSON']['output']>;
  hasAccessPage?: Maybe<Scalars['Boolean']['output']>;
  hasActivityLogs?: Maybe<Scalars['Boolean']['output']>;
  hasBasicUnlock?: Maybe<Scalars['Boolean']['output']>;
  hasIllustrationOnLockSettings?: Maybe<Scalars['Boolean']['output']>;
  hasLockSettings?: Maybe<Scalars['Boolean']['output']>;
  iconUrl: UploadFileEntityResponse;
  illustrationUrl: UploadFileEntityResponse;
  isHasDeleteAllPins?: Maybe<Scalars['Boolean']['output']>;
  isMiniBatteryDisplayMode?: Maybe<Scalars['Boolean']['output']>;
  lockAwakePairingImageIllustrationUrl: UploadFileEntityResponse;
  lockAwakePairingInstruction?: Maybe<ConfigTranslationEntityResponse>;
  notSupportMasterPin?: Maybe<Scalars['Boolean']['output']>;
  pairingInstruction?: Maybe<ConfigTranslationEntityResponse>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  showActivityLogsAboveLockName?: Maybe<Scalars['Boolean']['output']>;
  showBridgeNotBlinkingInstruction?: Maybe<Scalars['Boolean']['output']>;
  showDevicePropertyAboveLockName?: Maybe<Scalars['Boolean']['output']>;
  showMiniBAtteryBelowLockName?: Maybe<Scalars['Boolean']['output']>;
  skuId?: Maybe<SkuEntityResponse>;
  uniqName: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  videoPairingInstructionUrl?: Maybe<UploadFileRelationResponseCollection>;
};


export type IghSkuConfigVideoPairingInstructionUrlArgs = {
  filters?: InputMaybe<UploadFileFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type IghSkuConfigEntity = {
  __typename?: 'IghSkuConfigEntity';
  attributes?: Maybe<IghSkuConfig>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type IghSkuConfigEntityResponse = {
  __typename?: 'IghSkuConfigEntityResponse';
  data?: Maybe<IghSkuConfigEntity>;
};

export type IghSkuConfigEntityResponseCollection = {
  __typename?: 'IghSkuConfigEntityResponseCollection';
  data: Array<IghSkuConfigEntity>;
  meta: ResponseCollectionMeta;
};

export type IghSkuConfigFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<IghSkuConfigFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  filtersBtForPairingRegex?: InputMaybe<JsonFilterInput>;
  hasAccessPage?: InputMaybe<BooleanFilterInput>;
  hasActivityLogs?: InputMaybe<BooleanFilterInput>;
  hasBasicUnlock?: InputMaybe<BooleanFilterInput>;
  hasIllustrationOnLockSettings?: InputMaybe<BooleanFilterInput>;
  hasLockSettings?: InputMaybe<BooleanFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  isHasDeleteAllPins?: InputMaybe<BooleanFilterInput>;
  isMiniBatteryDisplayMode?: InputMaybe<BooleanFilterInput>;
  lockAwakePairingInstruction?: InputMaybe<ConfigTranslationFiltersInput>;
  not?: InputMaybe<IghSkuConfigFiltersInput>;
  notSupportMasterPin?: InputMaybe<BooleanFilterInput>;
  or?: InputMaybe<Array<InputMaybe<IghSkuConfigFiltersInput>>>;
  pairingInstruction?: InputMaybe<ConfigTranslationFiltersInput>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  showActivityLogsAboveLockName?: InputMaybe<BooleanFilterInput>;
  showBridgeNotBlinkingInstruction?: InputMaybe<BooleanFilterInput>;
  showDevicePropertyAboveLockName?: InputMaybe<BooleanFilterInput>;
  showMiniBAtteryBelowLockName?: InputMaybe<BooleanFilterInput>;
  skuId?: InputMaybe<SkuFiltersInput>;
  uniqName?: InputMaybe<StringFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type IghSkuConfigInput = {
  filtersBtForPairingRegex?: InputMaybe<Scalars['JSON']['input']>;
  hasAccessPage?: InputMaybe<Scalars['Boolean']['input']>;
  hasActivityLogs?: InputMaybe<Scalars['Boolean']['input']>;
  hasBasicUnlock?: InputMaybe<Scalars['Boolean']['input']>;
  hasIllustrationOnLockSettings?: InputMaybe<Scalars['Boolean']['input']>;
  hasLockSettings?: InputMaybe<Scalars['Boolean']['input']>;
  iconUrl?: InputMaybe<Scalars['ID']['input']>;
  illustrationUrl?: InputMaybe<Scalars['ID']['input']>;
  isHasDeleteAllPins?: InputMaybe<Scalars['Boolean']['input']>;
  isMiniBatteryDisplayMode?: InputMaybe<Scalars['Boolean']['input']>;
  lockAwakePairingImageIllustrationUrl?: InputMaybe<Scalars['ID']['input']>;
  lockAwakePairingInstruction?: InputMaybe<Scalars['ID']['input']>;
  notSupportMasterPin?: InputMaybe<Scalars['Boolean']['input']>;
  pairingInstruction?: InputMaybe<Scalars['ID']['input']>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
  showActivityLogsAboveLockName?: InputMaybe<Scalars['Boolean']['input']>;
  showBridgeNotBlinkingInstruction?: InputMaybe<Scalars['Boolean']['input']>;
  showDevicePropertyAboveLockName?: InputMaybe<Scalars['Boolean']['input']>;
  showMiniBAtteryBelowLockName?: InputMaybe<Scalars['Boolean']['input']>;
  skuId?: InputMaybe<Scalars['ID']['input']>;
  uniqName?: InputMaybe<Scalars['String']['input']>;
  videoPairingInstructionUrl?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};

export type IgloohomeChangelog = {
  __typename?: 'IgloohomeChangelog';
  AppVersion?: Maybe<Scalars['String']['output']>;
  Changes?: Maybe<Scalars['String']['output']>;
  ReleaseDate?: Maybe<Scalars['Date']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  locale?: Maybe<Scalars['String']['output']>;
  localizations?: Maybe<IgloohomeChangelogRelationResponseCollection>;
  nnn?: Maybe<Scalars['JSON']['output']>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};


export type IgloohomeChangelogLocalizationsArgs = {
  filters?: InputMaybe<IgloohomeChangelogFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type IgloohomeChangelogEntity = {
  __typename?: 'IgloohomeChangelogEntity';
  attributes?: Maybe<IgloohomeChangelog>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type IgloohomeChangelogEntityResponse = {
  __typename?: 'IgloohomeChangelogEntityResponse';
  data?: Maybe<IgloohomeChangelogEntity>;
};

export type IgloohomeChangelogEntityResponseCollection = {
  __typename?: 'IgloohomeChangelogEntityResponseCollection';
  data: Array<IgloohomeChangelogEntity>;
  meta: ResponseCollectionMeta;
};

export type IgloohomeChangelogFiltersInput = {
  AppVersion?: InputMaybe<StringFilterInput>;
  Changes?: InputMaybe<StringFilterInput>;
  ReleaseDate?: InputMaybe<DateFilterInput>;
  and?: InputMaybe<Array<InputMaybe<IgloohomeChangelogFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  locale?: InputMaybe<StringFilterInput>;
  localizations?: InputMaybe<IgloohomeChangelogFiltersInput>;
  nnn?: InputMaybe<JsonFilterInput>;
  not?: InputMaybe<IgloohomeChangelogFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<IgloohomeChangelogFiltersInput>>>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type IgloohomeChangelogInput = {
  AppVersion?: InputMaybe<Scalars['String']['input']>;
  Changes?: InputMaybe<Scalars['String']['input']>;
  ReleaseDate?: InputMaybe<Scalars['Date']['input']>;
  nnn?: InputMaybe<Scalars['JSON']['input']>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type IgloohomeChangelogRelationResponseCollection = {
  __typename?: 'IgloohomeChangelogRelationResponseCollection';
  data: Array<IgloohomeChangelogEntity>;
};

export type IgloohomeFaq = {
  __typename?: 'IgloohomeFaq';
  Category?: Maybe<IgloohomeFaqCategoryEntityResponse>;
  Content?: Maybe<Scalars['String']['output']>;
  Title?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  locale?: Maybe<Scalars['String']['output']>;
  localizations?: Maybe<IgloohomeFaqRelationResponseCollection>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};


export type IgloohomeFaqLocalizationsArgs = {
  filters?: InputMaybe<IgloohomeFaqFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type IgloohomeFaqCategory = {
  __typename?: 'IgloohomeFaqCategory';
  Description?: Maybe<Scalars['String']['output']>;
  Name?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  locale?: Maybe<Scalars['String']['output']>;
  localizations?: Maybe<IgloohomeFaqCategoryRelationResponseCollection>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};


export type IgloohomeFaqCategoryLocalizationsArgs = {
  filters?: InputMaybe<IgloohomeFaqCategoryFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type IgloohomeFaqCategoryEntity = {
  __typename?: 'IgloohomeFaqCategoryEntity';
  attributes?: Maybe<IgloohomeFaqCategory>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type IgloohomeFaqCategoryEntityResponse = {
  __typename?: 'IgloohomeFaqCategoryEntityResponse';
  data?: Maybe<IgloohomeFaqCategoryEntity>;
};

export type IgloohomeFaqCategoryEntityResponseCollection = {
  __typename?: 'IgloohomeFaqCategoryEntityResponseCollection';
  data: Array<IgloohomeFaqCategoryEntity>;
  meta: ResponseCollectionMeta;
};

export type IgloohomeFaqCategoryFiltersInput = {
  Description?: InputMaybe<StringFilterInput>;
  Name?: InputMaybe<StringFilterInput>;
  and?: InputMaybe<Array<InputMaybe<IgloohomeFaqCategoryFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  locale?: InputMaybe<StringFilterInput>;
  localizations?: InputMaybe<IgloohomeFaqCategoryFiltersInput>;
  not?: InputMaybe<IgloohomeFaqCategoryFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<IgloohomeFaqCategoryFiltersInput>>>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type IgloohomeFaqCategoryInput = {
  Description?: InputMaybe<Scalars['String']['input']>;
  Name?: InputMaybe<Scalars['String']['input']>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type IgloohomeFaqCategoryRelationResponseCollection = {
  __typename?: 'IgloohomeFaqCategoryRelationResponseCollection';
  data: Array<IgloohomeFaqCategoryEntity>;
};

export type IgloohomeFaqEntity = {
  __typename?: 'IgloohomeFaqEntity';
  attributes?: Maybe<IgloohomeFaq>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type IgloohomeFaqEntityResponse = {
  __typename?: 'IgloohomeFaqEntityResponse';
  data?: Maybe<IgloohomeFaqEntity>;
};

export type IgloohomeFaqEntityResponseCollection = {
  __typename?: 'IgloohomeFaqEntityResponseCollection';
  data: Array<IgloohomeFaqEntity>;
  meta: ResponseCollectionMeta;
};

export type IgloohomeFaqFiltersInput = {
  Category?: InputMaybe<IgloohomeFaqCategoryFiltersInput>;
  Content?: InputMaybe<StringFilterInput>;
  Title?: InputMaybe<StringFilterInput>;
  and?: InputMaybe<Array<InputMaybe<IgloohomeFaqFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  locale?: InputMaybe<StringFilterInput>;
  localizations?: InputMaybe<IgloohomeFaqFiltersInput>;
  not?: InputMaybe<IgloohomeFaqFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<IgloohomeFaqFiltersInput>>>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type IgloohomeFaqInput = {
  Category?: InputMaybe<Scalars['ID']['input']>;
  Content?: InputMaybe<Scalars['String']['input']>;
  Title?: InputMaybe<Scalars['String']['input']>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type IgloohomeFaqRelationResponseCollection = {
  __typename?: 'IgloohomeFaqRelationResponseCollection';
  data: Array<IgloohomeFaqEntity>;
};

export type IgloohomeHighlightedServiceBanner = {
  __typename?: 'IgloohomeHighlightedServiceBanner';
  background: UploadFileEntityResponse;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description: Scalars['String']['output'];
  icon: UploadFileEntityResponse;
  locale?: Maybe<Scalars['String']['output']>;
  localizations?: Maybe<IgloohomeHighlightedServiceBannerRelationResponseCollection>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  stripeProductId: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};


export type IgloohomeHighlightedServiceBannerLocalizationsArgs = {
  filters?: InputMaybe<IgloohomeHighlightedServiceBannerFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type IgloohomeHighlightedServiceBannerEntity = {
  __typename?: 'IgloohomeHighlightedServiceBannerEntity';
  attributes?: Maybe<IgloohomeHighlightedServiceBanner>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type IgloohomeHighlightedServiceBannerEntityResponse = {
  __typename?: 'IgloohomeHighlightedServiceBannerEntityResponse';
  data?: Maybe<IgloohomeHighlightedServiceBannerEntity>;
};

export type IgloohomeHighlightedServiceBannerEntityResponseCollection = {
  __typename?: 'IgloohomeHighlightedServiceBannerEntityResponseCollection';
  data: Array<IgloohomeHighlightedServiceBannerEntity>;
  meta: ResponseCollectionMeta;
};

export type IgloohomeHighlightedServiceBannerFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<IgloohomeHighlightedServiceBannerFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  description?: InputMaybe<StringFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  locale?: InputMaybe<StringFilterInput>;
  localizations?: InputMaybe<IgloohomeHighlightedServiceBannerFiltersInput>;
  not?: InputMaybe<IgloohomeHighlightedServiceBannerFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<IgloohomeHighlightedServiceBannerFiltersInput>>>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  stripeProductId?: InputMaybe<StringFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type IgloohomeHighlightedServiceBannerInput = {
  background?: InputMaybe<Scalars['ID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  icon?: InputMaybe<Scalars['ID']['input']>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
  stripeProductId?: InputMaybe<Scalars['String']['input']>;
};

export type IgloohomeHighlightedServiceBannerRelationResponseCollection = {
  __typename?: 'IgloohomeHighlightedServiceBannerRelationResponseCollection';
  data: Array<IgloohomeHighlightedServiceBannerEntity>;
};

export type IgwChangelog = {
  __typename?: 'IgwChangelog';
  ReleaseDate?: Maybe<Scalars['Date']['output']>;
  Version?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  igw_changelog_dtls?: Maybe<IgwChangelogDtlRelationResponseCollection>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};


export type IgwChangelogIgw_Changelog_DtlsArgs = {
  filters?: InputMaybe<IgwChangelogDtlFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type IgwChangelogDtl = {
  __typename?: 'IgwChangelogDtl';
  Changes: Scalars['String']['output'];
  Title: Scalars['String']['output'];
  changelog_tags?: Maybe<ChangelogTagRelationResponseCollection>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  igw_changelog?: Maybe<IgwChangelogEntityResponse>;
  locale?: Maybe<Scalars['String']['output']>;
  localizations?: Maybe<IgwChangelogDtlRelationResponseCollection>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};


export type IgwChangelogDtlChangelog_TagsArgs = {
  filters?: InputMaybe<ChangelogTagFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type IgwChangelogDtlLocalizationsArgs = {
  filters?: InputMaybe<IgwChangelogDtlFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type IgwChangelogDtlEntity = {
  __typename?: 'IgwChangelogDtlEntity';
  attributes?: Maybe<IgwChangelogDtl>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type IgwChangelogDtlEntityResponse = {
  __typename?: 'IgwChangelogDtlEntityResponse';
  data?: Maybe<IgwChangelogDtlEntity>;
};

export type IgwChangelogDtlEntityResponseCollection = {
  __typename?: 'IgwChangelogDtlEntityResponseCollection';
  data: Array<IgwChangelogDtlEntity>;
  meta: ResponseCollectionMeta;
};

export type IgwChangelogDtlFiltersInput = {
  Changes?: InputMaybe<StringFilterInput>;
  Title?: InputMaybe<StringFilterInput>;
  and?: InputMaybe<Array<InputMaybe<IgwChangelogDtlFiltersInput>>>;
  changelog_tags?: InputMaybe<ChangelogTagFiltersInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  igw_changelog?: InputMaybe<IgwChangelogFiltersInput>;
  locale?: InputMaybe<StringFilterInput>;
  localizations?: InputMaybe<IgwChangelogDtlFiltersInput>;
  not?: InputMaybe<IgwChangelogDtlFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<IgwChangelogDtlFiltersInput>>>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type IgwChangelogDtlInput = {
  Changes?: InputMaybe<Scalars['String']['input']>;
  Title?: InputMaybe<Scalars['String']['input']>;
  changelog_tags?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  igw_changelog?: InputMaybe<Scalars['ID']['input']>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type IgwChangelogDtlRelationResponseCollection = {
  __typename?: 'IgwChangelogDtlRelationResponseCollection';
  data: Array<IgwChangelogDtlEntity>;
};

export type IgwChangelogEntity = {
  __typename?: 'IgwChangelogEntity';
  attributes?: Maybe<IgwChangelog>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type IgwChangelogEntityResponse = {
  __typename?: 'IgwChangelogEntityResponse';
  data?: Maybe<IgwChangelogEntity>;
};

export type IgwChangelogEntityResponseCollection = {
  __typename?: 'IgwChangelogEntityResponseCollection';
  data: Array<IgwChangelogEntity>;
  meta: ResponseCollectionMeta;
};

export type IgwChangelogFiltersInput = {
  ReleaseDate?: InputMaybe<DateFilterInput>;
  Version?: InputMaybe<StringFilterInput>;
  and?: InputMaybe<Array<InputMaybe<IgwChangelogFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  igw_changelog_dtls?: InputMaybe<IgwChangelogDtlFiltersInput>;
  not?: InputMaybe<IgwChangelogFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<IgwChangelogFiltersInput>>>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type IgwChangelogInput = {
  ReleaseDate?: InputMaybe<Scalars['Date']['input']>;
  Version?: InputMaybe<Scalars['String']['input']>;
  igw_changelog_dtls?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type IntFilterInput = {
  and?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  between?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  contains?: InputMaybe<Scalars['Int']['input']>;
  containsi?: InputMaybe<Scalars['Int']['input']>;
  endsWith?: InputMaybe<Scalars['Int']['input']>;
  eq?: InputMaybe<Scalars['Int']['input']>;
  eqi?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  ne?: InputMaybe<Scalars['Int']['input']>;
  nei?: InputMaybe<Scalars['Int']['input']>;
  not?: InputMaybe<IntFilterInput>;
  notContains?: InputMaybe<Scalars['Int']['input']>;
  notContainsi?: InputMaybe<Scalars['Int']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  notNull?: InputMaybe<Scalars['Boolean']['input']>;
  null?: InputMaybe<Scalars['Boolean']['input']>;
  or?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  startsWith?: InputMaybe<Scalars['Int']['input']>;
};

export type JsonFilterInput = {
  and?: InputMaybe<Array<InputMaybe<Scalars['JSON']['input']>>>;
  between?: InputMaybe<Array<InputMaybe<Scalars['JSON']['input']>>>;
  contains?: InputMaybe<Scalars['JSON']['input']>;
  containsi?: InputMaybe<Scalars['JSON']['input']>;
  endsWith?: InputMaybe<Scalars['JSON']['input']>;
  eq?: InputMaybe<Scalars['JSON']['input']>;
  eqi?: InputMaybe<Scalars['JSON']['input']>;
  gt?: InputMaybe<Scalars['JSON']['input']>;
  gte?: InputMaybe<Scalars['JSON']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['JSON']['input']>>>;
  lt?: InputMaybe<Scalars['JSON']['input']>;
  lte?: InputMaybe<Scalars['JSON']['input']>;
  ne?: InputMaybe<Scalars['JSON']['input']>;
  nei?: InputMaybe<Scalars['JSON']['input']>;
  not?: InputMaybe<JsonFilterInput>;
  notContains?: InputMaybe<Scalars['JSON']['input']>;
  notContainsi?: InputMaybe<Scalars['JSON']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['JSON']['input']>>>;
  notNull?: InputMaybe<Scalars['Boolean']['input']>;
  null?: InputMaybe<Scalars['Boolean']['input']>;
  or?: InputMaybe<Array<InputMaybe<Scalars['JSON']['input']>>>;
  startsWith?: InputMaybe<Scalars['JSON']['input']>;
};

export enum LanguageDescType {
  Cs = 'CS',
  Da = 'DA',
  De = 'DE',
  El = 'EL',
  En = 'EN',
  Es = 'ES',
  Fi = 'FI',
  Fr = 'FR',
  Hu = 'HU',
  Id = 'ID',
  It = 'IT',
  Ja = 'JA',
  Nb = 'NB',
  Pt = 'PT',
  Sk = 'SK',
  Sv = 'SV',
  Th = 'TH',
  Vi = 'VI',
  Zh = 'ZH'
}

export type ListProduct = {
  __typename?: 'ListProduct';
  data?: Maybe<Array<Maybe<Product>>>;
  hasMore?: Maybe<Scalars['Boolean']['output']>;
  meta?: Maybe<Meta>;
};

export type ManualPairingCategory = {
  __typename?: 'ManualPairingCategory';
  category?: Maybe<Enum_Manualpairingcategory_Category>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  skuRefs?: Maybe<SkuRelationResponseCollection>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};


export type ManualPairingCategorySkuRefsArgs = {
  filters?: InputMaybe<SkuFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ManualPairingCategoryEntity = {
  __typename?: 'ManualPairingCategoryEntity';
  attributes?: Maybe<ManualPairingCategory>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type ManualPairingCategoryEntityResponse = {
  __typename?: 'ManualPairingCategoryEntityResponse';
  data?: Maybe<ManualPairingCategoryEntity>;
};

export type ManualPairingCategoryEntityResponseCollection = {
  __typename?: 'ManualPairingCategoryEntityResponseCollection';
  data: Array<ManualPairingCategoryEntity>;
  meta: ResponseCollectionMeta;
};

export type ManualPairingCategoryFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ManualPairingCategoryFiltersInput>>>;
  category?: InputMaybe<StringFilterInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  not?: InputMaybe<ManualPairingCategoryFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ManualPairingCategoryFiltersInput>>>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  skuRefs?: InputMaybe<SkuFiltersInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type ManualPairingCategoryInput = {
  category?: InputMaybe<Enum_Manualpairingcategory_Category>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
  skuRefs?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};

export type Meta = {
  __typename?: 'Meta';
  pagination?: Maybe<Pagination>;
};

export type Mutation = {
  __typename?: 'Mutation';
  changePassword?: Maybe<UsersPermissionsLoginPayload>;
  createCfLockModuleType?: Maybe<CfLockModuleTypeEntityResponse>;
  createChangelogTag?: Maybe<ChangelogTagEntityResponse>;
  createConfigTranslation?: Maybe<ConfigTranslationEntityResponse>;
  createConfigTranslationLocalization?: Maybe<ConfigTranslationEntityResponse>;
  createIghAirbnbTemplatesLocalization?: Maybe<IghAirbnbTemplatesEntityResponse>;
  createIghManifest?: Maybe<IghManifestEntityResponse>;
  createIghRemoteConfig?: Maybe<IghRemoteConfigEntityResponse>;
  createIghScBannerStyle?: Maybe<IghScBannerStyleEntityResponse>;
  createIghShowcaseBanner?: Maybe<IghShowcaseBannerEntityResponse>;
  createIghShowcaseBannerLocalization?: Maybe<IghShowcaseBannerEntityResponse>;
  createIghSkuConfig?: Maybe<IghSkuConfigEntityResponse>;
  createIgloohomeChangelog?: Maybe<IgloohomeChangelogEntityResponse>;
  createIgloohomeChangelogLocalization?: Maybe<IgloohomeChangelogEntityResponse>;
  createIgloohomeFaq?: Maybe<IgloohomeFaqEntityResponse>;
  createIgloohomeFaqCategory?: Maybe<IgloohomeFaqCategoryEntityResponse>;
  createIgloohomeFaqCategoryLocalization?: Maybe<IgloohomeFaqCategoryEntityResponse>;
  createIgloohomeFaqLocalization?: Maybe<IgloohomeFaqEntityResponse>;
  createIgloohomeHighlightedServiceBanner?: Maybe<IgloohomeHighlightedServiceBannerEntityResponse>;
  createIgloohomeHighlightedServiceBannerLocalization?: Maybe<IgloohomeHighlightedServiceBannerEntityResponse>;
  createIgwChangelog?: Maybe<IgwChangelogEntityResponse>;
  createIgwChangelogDtl?: Maybe<IgwChangelogDtlEntityResponse>;
  createIgwChangelogDtlLocalization?: Maybe<IgwChangelogDtlEntityResponse>;
  createManualPairingCategory?: Maybe<ManualPairingCategoryEntityResponse>;
  createPrivacyPolicy?: Maybe<PrivacyPolicyEntityResponse>;
  createPrivacyPolicyLocalization?: Maybe<PrivacyPolicyEntityResponse>;
  createSku?: Maybe<SkuEntityResponse>;
  createSkuFeature?: Maybe<SkuFeatureEntityResponse>;
  createStripeSyncStripeDesc?: Maybe<StripeSyncStripeDescEntityResponse>;
  createUploadFile?: Maybe<UploadFileEntityResponse>;
  createUploadFolder?: Maybe<UploadFolderEntityResponse>;
  createUsersPermissionsRole?: Maybe<UsersPermissionsCreateRolePayload>;
  createUsersPermissionsUser: UsersPermissionsUserEntityResponse;
  deleteCfLockModuleType?: Maybe<CfLockModuleTypeEntityResponse>;
  deleteChangelogTag?: Maybe<ChangelogTagEntityResponse>;
  deleteConfigTranslation?: Maybe<ConfigTranslationEntityResponse>;
  deleteIghAirbnbTemplates?: Maybe<IghAirbnbTemplatesEntityResponse>;
  deleteIghManifest?: Maybe<IghManifestEntityResponse>;
  deleteIghRemoteConfig?: Maybe<IghRemoteConfigEntityResponse>;
  deleteIghScBannerStyle?: Maybe<IghScBannerStyleEntityResponse>;
  deleteIghShowcaseBanner?: Maybe<IghShowcaseBannerEntityResponse>;
  deleteIghSkuConfig?: Maybe<IghSkuConfigEntityResponse>;
  deleteIgloohomeChangelog?: Maybe<IgloohomeChangelogEntityResponse>;
  deleteIgloohomeFaq?: Maybe<IgloohomeFaqEntityResponse>;
  deleteIgloohomeFaqCategory?: Maybe<IgloohomeFaqCategoryEntityResponse>;
  deleteIgloohomeHighlightedServiceBanner?: Maybe<IgloohomeHighlightedServiceBannerEntityResponse>;
  deleteIgwChangelog?: Maybe<IgwChangelogEntityResponse>;
  deleteIgwChangelogDtl?: Maybe<IgwChangelogDtlEntityResponse>;
  deleteManualPairingCategory?: Maybe<ManualPairingCategoryEntityResponse>;
  deletePrivacyPolicy?: Maybe<PrivacyPolicyEntityResponse>;
  deleteSku?: Maybe<SkuEntityResponse>;
  deleteSkuFeature?: Maybe<SkuFeatureEntityResponse>;
  deleteStripeSyncStripeDesc?: Maybe<StripeSyncStripeDescEntityResponse>;
  deleteUploadFile?: Maybe<UploadFileEntityResponse>;
  deleteUploadFolder?: Maybe<UploadFolderEntityResponse>;
  deleteUsersPermissionsRole?: Maybe<UsersPermissionsDeleteRolePayload>;
  deleteUsersPermissionsUser: UsersPermissionsUserEntityResponse;
  emailConfirmation?: Maybe<UsersPermissionsLoginPayload>;
  forgotPassword?: Maybe<UsersPermissionsPasswordPayload>;
  login: UsersPermissionsLoginPayload;
  multipleUpload: Array<Maybe<UploadFileEntityResponse>>;
  register: UsersPermissionsLoginPayload;
  removeFile?: Maybe<UploadFileEntityResponse>;
  resetPassword?: Maybe<UsersPermissionsLoginPayload>;
  updateCfLockModuleType?: Maybe<CfLockModuleTypeEntityResponse>;
  updateChangelogTag?: Maybe<ChangelogTagEntityResponse>;
  updateConfigTranslation?: Maybe<ConfigTranslationEntityResponse>;
  updateFileInfo: UploadFileEntityResponse;
  updateIghAirbnbTemplates?: Maybe<IghAirbnbTemplatesEntityResponse>;
  updateIghManifest?: Maybe<IghManifestEntityResponse>;
  updateIghRemoteConfig?: Maybe<IghRemoteConfigEntityResponse>;
  updateIghScBannerStyle?: Maybe<IghScBannerStyleEntityResponse>;
  updateIghShowcaseBanner?: Maybe<IghShowcaseBannerEntityResponse>;
  updateIghSkuConfig?: Maybe<IghSkuConfigEntityResponse>;
  updateIgloohomeChangelog?: Maybe<IgloohomeChangelogEntityResponse>;
  updateIgloohomeFaq?: Maybe<IgloohomeFaqEntityResponse>;
  updateIgloohomeFaqCategory?: Maybe<IgloohomeFaqCategoryEntityResponse>;
  updateIgloohomeHighlightedServiceBanner?: Maybe<IgloohomeHighlightedServiceBannerEntityResponse>;
  updateIgwChangelog?: Maybe<IgwChangelogEntityResponse>;
  updateIgwChangelogDtl?: Maybe<IgwChangelogDtlEntityResponse>;
  updateManualPairingCategory?: Maybe<ManualPairingCategoryEntityResponse>;
  updatePrivacyPolicy?: Maybe<PrivacyPolicyEntityResponse>;
  updateSku?: Maybe<SkuEntityResponse>;
  updateSkuFeature?: Maybe<SkuFeatureEntityResponse>;
  updateStripeSyncStripeDesc?: Maybe<StripeSyncStripeDescEntityResponse>;
  updateUploadFile?: Maybe<UploadFileEntityResponse>;
  updateUploadFolder?: Maybe<UploadFolderEntityResponse>;
  updateUsersPermissionsRole?: Maybe<UsersPermissionsUpdateRolePayload>;
  updateUsersPermissionsUser: UsersPermissionsUserEntityResponse;
  upload: UploadFileEntityResponse;
};


export type MutationChangePasswordArgs = {
  currentPassword: Scalars['String']['input'];
  password: Scalars['String']['input'];
  passwordConfirmation: Scalars['String']['input'];
};


export type MutationCreateCfLockModuleTypeArgs = {
  data: CfLockModuleTypeInput;
};


export type MutationCreateChangelogTagArgs = {
  data: ChangelogTagInput;
};


export type MutationCreateConfigTranslationArgs = {
  data: ConfigTranslationInput;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationCreateConfigTranslationLocalizationArgs = {
  data?: InputMaybe<ConfigTranslationInput>;
  id?: InputMaybe<Scalars['ID']['input']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationCreateIghAirbnbTemplatesLocalizationArgs = {
  data?: InputMaybe<IghAirbnbTemplatesInput>;
  id?: InputMaybe<Scalars['ID']['input']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationCreateIghManifestArgs = {
  data: IghManifestInput;
};


export type MutationCreateIghRemoteConfigArgs = {
  data: IghRemoteConfigInput;
};


export type MutationCreateIghScBannerStyleArgs = {
  data: IghScBannerStyleInput;
};


export type MutationCreateIghShowcaseBannerArgs = {
  data: IghShowcaseBannerInput;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationCreateIghShowcaseBannerLocalizationArgs = {
  data?: InputMaybe<IghShowcaseBannerInput>;
  id?: InputMaybe<Scalars['ID']['input']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationCreateIghSkuConfigArgs = {
  data: IghSkuConfigInput;
};


export type MutationCreateIgloohomeChangelogArgs = {
  data: IgloohomeChangelogInput;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationCreateIgloohomeChangelogLocalizationArgs = {
  data?: InputMaybe<IgloohomeChangelogInput>;
  id?: InputMaybe<Scalars['ID']['input']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationCreateIgloohomeFaqArgs = {
  data: IgloohomeFaqInput;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationCreateIgloohomeFaqCategoryArgs = {
  data: IgloohomeFaqCategoryInput;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationCreateIgloohomeFaqCategoryLocalizationArgs = {
  data?: InputMaybe<IgloohomeFaqCategoryInput>;
  id?: InputMaybe<Scalars['ID']['input']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationCreateIgloohomeFaqLocalizationArgs = {
  data?: InputMaybe<IgloohomeFaqInput>;
  id?: InputMaybe<Scalars['ID']['input']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationCreateIgloohomeHighlightedServiceBannerArgs = {
  data: IgloohomeHighlightedServiceBannerInput;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationCreateIgloohomeHighlightedServiceBannerLocalizationArgs = {
  data?: InputMaybe<IgloohomeHighlightedServiceBannerInput>;
  id?: InputMaybe<Scalars['ID']['input']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationCreateIgwChangelogArgs = {
  data: IgwChangelogInput;
};


export type MutationCreateIgwChangelogDtlArgs = {
  data: IgwChangelogDtlInput;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationCreateIgwChangelogDtlLocalizationArgs = {
  data?: InputMaybe<IgwChangelogDtlInput>;
  id?: InputMaybe<Scalars['ID']['input']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationCreateManualPairingCategoryArgs = {
  data: ManualPairingCategoryInput;
};


export type MutationCreatePrivacyPolicyArgs = {
  data: PrivacyPolicyInput;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationCreatePrivacyPolicyLocalizationArgs = {
  data?: InputMaybe<PrivacyPolicyInput>;
  id?: InputMaybe<Scalars['ID']['input']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationCreateSkuArgs = {
  data: SkuInput;
};


export type MutationCreateSkuFeatureArgs = {
  data: SkuFeatureInput;
};


export type MutationCreateStripeSyncStripeDescArgs = {
  data: StripeSyncStripeDescInput;
};


export type MutationCreateUploadFileArgs = {
  data: UploadFileInput;
};


export type MutationCreateUploadFolderArgs = {
  data: UploadFolderInput;
};


export type MutationCreateUsersPermissionsRoleArgs = {
  data: UsersPermissionsRoleInput;
};


export type MutationCreateUsersPermissionsUserArgs = {
  data: UsersPermissionsUserInput;
};


export type MutationDeleteCfLockModuleTypeArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteChangelogTagArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteConfigTranslationArgs = {
  id: Scalars['ID']['input'];
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationDeleteIghAirbnbTemplatesArgs = {
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationDeleteIghManifestArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteIghRemoteConfigArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteIghScBannerStyleArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteIghShowcaseBannerArgs = {
  id: Scalars['ID']['input'];
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationDeleteIghSkuConfigArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteIgloohomeChangelogArgs = {
  id: Scalars['ID']['input'];
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationDeleteIgloohomeFaqArgs = {
  id: Scalars['ID']['input'];
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationDeleteIgloohomeFaqCategoryArgs = {
  id: Scalars['ID']['input'];
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationDeleteIgloohomeHighlightedServiceBannerArgs = {
  id: Scalars['ID']['input'];
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationDeleteIgwChangelogArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteIgwChangelogDtlArgs = {
  id: Scalars['ID']['input'];
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationDeleteManualPairingCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletePrivacyPolicyArgs = {
  id: Scalars['ID']['input'];
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationDeleteSkuArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteSkuFeatureArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteStripeSyncStripeDescArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUploadFileArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUploadFolderArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUsersPermissionsRoleArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUsersPermissionsUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationEmailConfirmationArgs = {
  confirmation: Scalars['String']['input'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String']['input'];
};


export type MutationLoginArgs = {
  input: UsersPermissionsLoginInput;
};


export type MutationMultipleUploadArgs = {
  field?: InputMaybe<Scalars['String']['input']>;
  files: Array<InputMaybe<Scalars['Upload']['input']>>;
  ref?: InputMaybe<Scalars['String']['input']>;
  refId?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationRegisterArgs = {
  input: UsersPermissionsRegisterInput;
};


export type MutationRemoveFileArgs = {
  id: Scalars['ID']['input'];
};


export type MutationResetPasswordArgs = {
  code: Scalars['String']['input'];
  password: Scalars['String']['input'];
  passwordConfirmation: Scalars['String']['input'];
};


export type MutationUpdateCfLockModuleTypeArgs = {
  data: CfLockModuleTypeInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateChangelogTagArgs = {
  data: ChangelogTagInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateConfigTranslationArgs = {
  data: ConfigTranslationInput;
  id: Scalars['ID']['input'];
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationUpdateFileInfoArgs = {
  id: Scalars['ID']['input'];
  info?: InputMaybe<FileInfoInput>;
};


export type MutationUpdateIghAirbnbTemplatesArgs = {
  data: IghAirbnbTemplatesInput;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationUpdateIghManifestArgs = {
  data: IghManifestInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateIghRemoteConfigArgs = {
  data: IghRemoteConfigInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateIghScBannerStyleArgs = {
  data: IghScBannerStyleInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateIghShowcaseBannerArgs = {
  data: IghShowcaseBannerInput;
  id: Scalars['ID']['input'];
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationUpdateIghSkuConfigArgs = {
  data: IghSkuConfigInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateIgloohomeChangelogArgs = {
  data: IgloohomeChangelogInput;
  id: Scalars['ID']['input'];
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationUpdateIgloohomeFaqArgs = {
  data: IgloohomeFaqInput;
  id: Scalars['ID']['input'];
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationUpdateIgloohomeFaqCategoryArgs = {
  data: IgloohomeFaqCategoryInput;
  id: Scalars['ID']['input'];
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationUpdateIgloohomeHighlightedServiceBannerArgs = {
  data: IgloohomeHighlightedServiceBannerInput;
  id: Scalars['ID']['input'];
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationUpdateIgwChangelogArgs = {
  data: IgwChangelogInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateIgwChangelogDtlArgs = {
  data: IgwChangelogDtlInput;
  id: Scalars['ID']['input'];
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationUpdateManualPairingCategoryArgs = {
  data: ManualPairingCategoryInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdatePrivacyPolicyArgs = {
  data: PrivacyPolicyInput;
  id: Scalars['ID']['input'];
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationUpdateSkuArgs = {
  data: SkuInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateSkuFeatureArgs = {
  data: SkuFeatureInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateStripeSyncStripeDescArgs = {
  data: StripeSyncStripeDescInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateUploadFileArgs = {
  data: UploadFileInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateUploadFolderArgs = {
  data: UploadFolderInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateUsersPermissionsRoleArgs = {
  data: UsersPermissionsRoleInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateUsersPermissionsUserArgs = {
  data: UsersPermissionsUserInput;
  id: Scalars['ID']['input'];
};


export type MutationUploadArgs = {
  field?: InputMaybe<Scalars['String']['input']>;
  file: Scalars['Upload']['input'];
  info?: InputMaybe<FileInfoInput>;
  ref?: InputMaybe<Scalars['String']['input']>;
  refId?: InputMaybe<Scalars['ID']['input']>;
};

export type Pagination = {
  __typename?: 'Pagination';
  page: Scalars['Int']['output'];
  pageCount: Scalars['Int']['output'];
  pageSize: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type PaginationArg = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  start?: InputMaybe<Scalars['Int']['input']>;
};

export enum PaymentType {
  Free = 'FREE',
  Postpaid = 'POSTPAID',
  Prepaid = 'PREPAID'
}

export type PrivacyPolicy = {
  __typename?: 'PrivacyPolicy';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  effectiveDate: Scalars['Date']['output'];
  featureKey: Scalars['String']['output'];
  locale?: Maybe<Scalars['String']['output']>;
  localizations?: Maybe<PrivacyPolicyRelationResponseCollection>;
  name: Scalars['String']['output'];
  privacyPolicyContent?: Maybe<ConfigTranslationEntityResponse>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  title?: Maybe<ConfigTranslationEntityResponse>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};


export type PrivacyPolicyLocalizationsArgs = {
  filters?: InputMaybe<PrivacyPolicyFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type PrivacyPolicyEntity = {
  __typename?: 'PrivacyPolicyEntity';
  attributes?: Maybe<PrivacyPolicy>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type PrivacyPolicyEntityResponse = {
  __typename?: 'PrivacyPolicyEntityResponse';
  data?: Maybe<PrivacyPolicyEntity>;
};

export type PrivacyPolicyEntityResponseCollection = {
  __typename?: 'PrivacyPolicyEntityResponseCollection';
  data: Array<PrivacyPolicyEntity>;
  meta: ResponseCollectionMeta;
};

export type PrivacyPolicyFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<PrivacyPolicyFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  effectiveDate?: InputMaybe<DateFilterInput>;
  featureKey?: InputMaybe<StringFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  locale?: InputMaybe<StringFilterInput>;
  localizations?: InputMaybe<PrivacyPolicyFiltersInput>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<PrivacyPolicyFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<PrivacyPolicyFiltersInput>>>;
  privacyPolicyContent?: InputMaybe<ConfigTranslationFiltersInput>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  title?: InputMaybe<ConfigTranslationFiltersInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type PrivacyPolicyInput = {
  effectiveDate?: InputMaybe<Scalars['Date']['input']>;
  featureKey?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  privacyPolicyContent?: InputMaybe<Scalars['ID']['input']>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
  title?: InputMaybe<Scalars['ID']['input']>;
};

export type PrivacyPolicyRelationResponseCollection = {
  __typename?: 'PrivacyPolicyRelationResponseCollection';
  data: Array<PrivacyPolicyEntity>;
};

export type Product = {
  __typename?: 'Product';
  description?: Maybe<Scalars['String']['output']>;
  descs?: Maybe<Array<Maybe<DescLang>>>;
  image?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  platformId: Scalars['String']['output'];
  stripeId: Scalars['String']['output'];
  tag?: Maybe<Array<Maybe<TagProduct>>>;
  visitUrl?: Maybe<Scalars['String']['output']>;
};

export type ProductFilterInput = {
  categoryType?: InputMaybe<Array<InputMaybe<CategoryType>>>;
  name?: InputMaybe<Scalars['String']['input']>;
  paymentType?: InputMaybe<Array<InputMaybe<PaymentType>>>;
};

export enum PublicationState {
  Live = 'LIVE',
  Preview = 'PREVIEW'
}

export type Query = {
  __typename?: 'Query';
  cfLockModuleType?: Maybe<CfLockModuleTypeEntityResponse>;
  cfLockModuleTypes?: Maybe<CfLockModuleTypeEntityResponseCollection>;
  changelogTag?: Maybe<ChangelogTagEntityResponse>;
  changelogTags?: Maybe<ChangelogTagEntityResponseCollection>;
  configTranslation?: Maybe<ConfigTranslationEntityResponse>;
  configTranslations?: Maybe<ConfigTranslationEntityResponseCollection>;
  i18NLocale?: Maybe<I18NLocaleEntityResponse>;
  i18NLocales?: Maybe<I18NLocaleEntityResponseCollection>;
  ighAirbnbTemplates?: Maybe<IghAirbnbTemplatesEntityResponse>;
  ighManifest?: Maybe<IghManifestEntityResponse>;
  ighManifests?: Maybe<IghManifestEntityResponseCollection>;
  ighRemoteConfig?: Maybe<IghRemoteConfigEntityResponse>;
  ighRemoteConfigs?: Maybe<IghRemoteConfigEntityResponseCollection>;
  ighScBannerStyle?: Maybe<IghScBannerStyleEntityResponse>;
  ighScBannerStyles?: Maybe<IghScBannerStyleEntityResponseCollection>;
  ighShowcaseBanner?: Maybe<IghShowcaseBannerEntityResponse>;
  ighShowcaseBanners?: Maybe<IghShowcaseBannerEntityResponseCollection>;
  ighSkuConfig?: Maybe<IghSkuConfigEntityResponse>;
  ighSkuConfigs?: Maybe<IghSkuConfigEntityResponseCollection>;
  igloohomeChangelog?: Maybe<IgloohomeChangelogEntityResponse>;
  igloohomeChangelogs?: Maybe<IgloohomeChangelogEntityResponseCollection>;
  igloohomeFaq?: Maybe<IgloohomeFaqEntityResponse>;
  igloohomeFaqCategories?: Maybe<IgloohomeFaqCategoryEntityResponseCollection>;
  igloohomeFaqCategory?: Maybe<IgloohomeFaqCategoryEntityResponse>;
  igloohomeFaqs?: Maybe<IgloohomeFaqEntityResponseCollection>;
  igloohomeHighlightedServiceBanner?: Maybe<IgloohomeHighlightedServiceBannerEntityResponse>;
  igloohomeHighlightedServiceBanners?: Maybe<IgloohomeHighlightedServiceBannerEntityResponseCollection>;
  igwChangelog?: Maybe<IgwChangelogEntityResponse>;
  igwChangelogDtl?: Maybe<IgwChangelogDtlEntityResponse>;
  igwChangelogDtls?: Maybe<IgwChangelogDtlEntityResponseCollection>;
  igwChangelogs?: Maybe<IgwChangelogEntityResponseCollection>;
  listProductConnection?: Maybe<ListProduct>;
  manualPairingCategories?: Maybe<ManualPairingCategoryEntityResponseCollection>;
  manualPairingCategory?: Maybe<ManualPairingCategoryEntityResponse>;
  me?: Maybe<UsersPermissionsMe>;
  privacyPolicies?: Maybe<PrivacyPolicyEntityResponseCollection>;
  privacyPolicy?: Maybe<PrivacyPolicyEntityResponse>;
  search?: Maybe<SearchResponse>;
  sku?: Maybe<SkuEntityResponse>;
  skuFeature?: Maybe<SkuFeatureEntityResponse>;
  skuFeatures?: Maybe<SkuFeatureEntityResponseCollection>;
  skus?: Maybe<SkuEntityResponseCollection>;
  stripeSyncStripeDesc?: Maybe<StripeSyncStripeDescEntityResponse>;
  stripeSyncStripeDescs?: Maybe<StripeSyncStripeDescEntityResponseCollection>;
  uploadFile?: Maybe<UploadFileEntityResponse>;
  uploadFiles?: Maybe<UploadFileEntityResponseCollection>;
  uploadFolder?: Maybe<UploadFolderEntityResponse>;
  uploadFolders?: Maybe<UploadFolderEntityResponseCollection>;
  usersPermissionsRole?: Maybe<UsersPermissionsRoleEntityResponse>;
  usersPermissionsRoles?: Maybe<UsersPermissionsRoleEntityResponseCollection>;
  usersPermissionsUser?: Maybe<UsersPermissionsUserEntityResponse>;
  usersPermissionsUsers?: Maybe<UsersPermissionsUserEntityResponseCollection>;
};


export type QueryCfLockModuleTypeArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryCfLockModuleTypesArgs = {
  filters?: InputMaybe<CfLockModuleTypeFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryChangelogTagArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryChangelogTagsArgs = {
  filters?: InputMaybe<ChangelogTagFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryConfigTranslationArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type QueryConfigTranslationsArgs = {
  filters?: InputMaybe<ConfigTranslationFiltersInput>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryI18NLocaleArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryI18NLocalesArgs = {
  filters?: InputMaybe<I18NLocaleFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryIghAirbnbTemplatesArgs = {
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
  publicationState?: InputMaybe<PublicationState>;
};


export type QueryIghManifestArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryIghManifestsArgs = {
  filters?: InputMaybe<IghManifestFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryIghRemoteConfigArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryIghRemoteConfigsArgs = {
  filters?: InputMaybe<IghRemoteConfigFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryIghScBannerStyleArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryIghScBannerStylesArgs = {
  filters?: InputMaybe<IghScBannerStyleFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryIghShowcaseBannerArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type QueryIghShowcaseBannersArgs = {
  filters?: InputMaybe<IghShowcaseBannerFiltersInput>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryIghSkuConfigArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryIghSkuConfigsArgs = {
  filters?: InputMaybe<IghSkuConfigFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryIgloohomeChangelogArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type QueryIgloohomeChangelogsArgs = {
  filters?: InputMaybe<IgloohomeChangelogFiltersInput>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryIgloohomeFaqArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type QueryIgloohomeFaqCategoriesArgs = {
  filters?: InputMaybe<IgloohomeFaqCategoryFiltersInput>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryIgloohomeFaqCategoryArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type QueryIgloohomeFaqsArgs = {
  filters?: InputMaybe<IgloohomeFaqFiltersInput>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryIgloohomeHighlightedServiceBannerArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type QueryIgloohomeHighlightedServiceBannersArgs = {
  filters?: InputMaybe<IgloohomeHighlightedServiceBannerFiltersInput>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryIgwChangelogArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryIgwChangelogDtlArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type QueryIgwChangelogDtlsArgs = {
  filters?: InputMaybe<IgwChangelogDtlFiltersInput>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryIgwChangelogsArgs = {
  filters?: InputMaybe<IgwChangelogFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryListProductConnectionArgs = {
  filter?: InputMaybe<ProductFilterInput>;
  langDesc?: InputMaybe<LanguageDescType>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortDirection>;
};


export type QueryManualPairingCategoriesArgs = {
  filters?: InputMaybe<ManualPairingCategoryFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryManualPairingCategoryArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryPrivacyPoliciesArgs = {
  filters?: InputMaybe<PrivacyPolicyFiltersInput>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryPrivacyPolicyArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type QuerySearchArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  query: Scalars['String']['input'];
};


export type QuerySkuArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QuerySkuFeatureArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QuerySkuFeaturesArgs = {
  filters?: InputMaybe<SkuFeatureFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QuerySkusArgs = {
  filters?: InputMaybe<SkuFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryStripeSyncStripeDescArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryStripeSyncStripeDescsArgs = {
  filters?: InputMaybe<StripeSyncStripeDescFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryUploadFileArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryUploadFilesArgs = {
  filters?: InputMaybe<UploadFileFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryUploadFolderArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryUploadFoldersArgs = {
  filters?: InputMaybe<UploadFolderFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryUsersPermissionsRoleArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryUsersPermissionsRolesArgs = {
  filters?: InputMaybe<UsersPermissionsRoleFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryUsersPermissionsUserArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryUsersPermissionsUsersArgs = {
  filters?: InputMaybe<UsersPermissionsUserFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ResponseCollectionMeta = {
  __typename?: 'ResponseCollectionMeta';
  pagination: Pagination;
};

export type SearchResponse = {
  __typename?: 'SearchResponse';
  igloohomeFaqs?: Maybe<IgloohomeFaqEntityResponseCollection>;
};


export type SearchResponseIgloohomeFaqsArgs = {
  filters?: InputMaybe<IgloohomeFaqFiltersInput>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
  pagination?: InputMaybe<PaginationArg>;
};

export type Sku = {
  __typename?: 'Sku';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  excludedBtPrefixRegex?: Maybe<Scalars['JSON']['output']>;
  featureRefs?: Maybe<SkuFeatureRelationResponseCollection>;
  filtersBtForPairing: Scalars['JSON']['output'];
  includedBtPrefixRegex: Scalars['JSON']['output'];
  isHasEmbeddedBattery?: Maybe<Scalars['Boolean']['output']>;
  isTZRequired?: Maybe<Scalars['Boolean']['output']>;
  lockModelName: Scalars['String']['output'];
  privacyPolicyRefs?: Maybe<PrivacyPolicyRelationResponseCollection>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  scannableWhenPaired: Scalars['Boolean']['output'];
  scannableWhenTouched: Scalars['Boolean']['output'];
  skuUniqName: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  whitelistedUsers?: Maybe<Scalars['JSON']['output']>;
};


export type SkuFeatureRefsArgs = {
  filters?: InputMaybe<SkuFeatureFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type SkuPrivacyPolicyRefsArgs = {
  filters?: InputMaybe<PrivacyPolicyFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type SkuEntity = {
  __typename?: 'SkuEntity';
  attributes?: Maybe<Sku>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type SkuEntityResponse = {
  __typename?: 'SkuEntityResponse';
  data?: Maybe<SkuEntity>;
};

export type SkuEntityResponseCollection = {
  __typename?: 'SkuEntityResponseCollection';
  data: Array<SkuEntity>;
  meta: ResponseCollectionMeta;
};

export type SkuFeature = {
  __typename?: 'SkuFeature';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  featureKey?: Maybe<Scalars['String']['output']>;
  featureValue?: Maybe<Scalars['JSON']['output']>;
  minFirmware?: Maybe<Scalars['String']['output']>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type SkuFeatureEntity = {
  __typename?: 'SkuFeatureEntity';
  attributes?: Maybe<SkuFeature>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type SkuFeatureEntityResponse = {
  __typename?: 'SkuFeatureEntityResponse';
  data?: Maybe<SkuFeatureEntity>;
};

export type SkuFeatureEntityResponseCollection = {
  __typename?: 'SkuFeatureEntityResponseCollection';
  data: Array<SkuFeatureEntity>;
  meta: ResponseCollectionMeta;
};

export type SkuFeatureFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<SkuFeatureFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  featureKey?: InputMaybe<StringFilterInput>;
  featureValue?: InputMaybe<JsonFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  minFirmware?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<SkuFeatureFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<SkuFeatureFiltersInput>>>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type SkuFeatureInput = {
  featureKey?: InputMaybe<Scalars['String']['input']>;
  featureValue?: InputMaybe<Scalars['JSON']['input']>;
  minFirmware?: InputMaybe<Scalars['String']['input']>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type SkuFeatureRelationResponseCollection = {
  __typename?: 'SkuFeatureRelationResponseCollection';
  data: Array<SkuFeatureEntity>;
};

export type SkuFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<SkuFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  excludedBtPrefixRegex?: InputMaybe<JsonFilterInput>;
  featureRefs?: InputMaybe<SkuFeatureFiltersInput>;
  filtersBtForPairing?: InputMaybe<JsonFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  includedBtPrefixRegex?: InputMaybe<JsonFilterInput>;
  isHasEmbeddedBattery?: InputMaybe<BooleanFilterInput>;
  isTZRequired?: InputMaybe<BooleanFilterInput>;
  lockModelName?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<SkuFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<SkuFiltersInput>>>;
  privacyPolicyRefs?: InputMaybe<PrivacyPolicyFiltersInput>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  scannableWhenPaired?: InputMaybe<BooleanFilterInput>;
  scannableWhenTouched?: InputMaybe<BooleanFilterInput>;
  skuUniqName?: InputMaybe<StringFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
  whitelistedUsers?: InputMaybe<JsonFilterInput>;
};

export type SkuInput = {
  excludedBtPrefixRegex?: InputMaybe<Scalars['JSON']['input']>;
  featureRefs?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  filtersBtForPairing?: InputMaybe<Scalars['JSON']['input']>;
  includedBtPrefixRegex?: InputMaybe<Scalars['JSON']['input']>;
  isHasEmbeddedBattery?: InputMaybe<Scalars['Boolean']['input']>;
  isTZRequired?: InputMaybe<Scalars['Boolean']['input']>;
  lockModelName?: InputMaybe<Scalars['String']['input']>;
  privacyPolicyRefs?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
  scannableWhenPaired?: InputMaybe<Scalars['Boolean']['input']>;
  scannableWhenTouched?: InputMaybe<Scalars['Boolean']['input']>;
  skuUniqName?: InputMaybe<Scalars['String']['input']>;
  whitelistedUsers?: InputMaybe<Scalars['JSON']['input']>;
};

export type SkuRelationResponseCollection = {
  __typename?: 'SkuRelationResponseCollection';
  data: Array<SkuEntity>;
};

export enum SortDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type StringFilterInput = {
  and?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  between?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  contains?: InputMaybe<Scalars['String']['input']>;
  containsi?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  eq?: InputMaybe<Scalars['String']['input']>;
  eqi?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nei?: InputMaybe<Scalars['String']['input']>;
  not?: InputMaybe<StringFilterInput>;
  notContains?: InputMaybe<Scalars['String']['input']>;
  notContainsi?: InputMaybe<Scalars['String']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  notNull?: InputMaybe<Scalars['Boolean']['input']>;
  null?: InputMaybe<Scalars['Boolean']['input']>;
  or?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type StripeSyncStripeDesc = {
  __typename?: 'StripeSyncStripeDesc';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  desc?: Maybe<Scalars['String']['output']>;
  lang: Scalars['String']['output'];
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type StripeSyncStripeDescEntity = {
  __typename?: 'StripeSyncStripeDescEntity';
  attributes?: Maybe<StripeSyncStripeDesc>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type StripeSyncStripeDescEntityResponse = {
  __typename?: 'StripeSyncStripeDescEntityResponse';
  data?: Maybe<StripeSyncStripeDescEntity>;
};

export type StripeSyncStripeDescEntityResponseCollection = {
  __typename?: 'StripeSyncStripeDescEntityResponseCollection';
  data: Array<StripeSyncStripeDescEntity>;
  meta: ResponseCollectionMeta;
};

export type StripeSyncStripeDescFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<StripeSyncStripeDescFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  desc?: InputMaybe<StringFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  lang?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<StripeSyncStripeDescFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<StripeSyncStripeDescFiltersInput>>>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type StripeSyncStripeDescInput = {
  desc?: InputMaybe<Scalars['String']['input']>;
  lang?: InputMaybe<Scalars['String']['input']>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type TagProduct = {
  __typename?: 'TagProduct';
  name?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

export type UploadFile = {
  __typename?: 'UploadFile';
  alternativeText?: Maybe<Scalars['String']['output']>;
  caption?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  ext?: Maybe<Scalars['String']['output']>;
  formats?: Maybe<Scalars['JSON']['output']>;
  hash: Scalars['String']['output'];
  height?: Maybe<Scalars['Int']['output']>;
  mime: Scalars['String']['output'];
  name: Scalars['String']['output'];
  previewUrl?: Maybe<Scalars['String']['output']>;
  provider: Scalars['String']['output'];
  provider_metadata?: Maybe<Scalars['JSON']['output']>;
  related?: Maybe<Array<Maybe<GenericMorph>>>;
  size: Scalars['Float']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  url: Scalars['String']['output'];
  width?: Maybe<Scalars['Int']['output']>;
};

export type UploadFileEntity = {
  __typename?: 'UploadFileEntity';
  attributes?: Maybe<UploadFile>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type UploadFileEntityResponse = {
  __typename?: 'UploadFileEntityResponse';
  data?: Maybe<UploadFileEntity>;
};

export type UploadFileEntityResponseCollection = {
  __typename?: 'UploadFileEntityResponseCollection';
  data: Array<UploadFileEntity>;
  meta: ResponseCollectionMeta;
};

export type UploadFileFiltersInput = {
  alternativeText?: InputMaybe<StringFilterInput>;
  and?: InputMaybe<Array<InputMaybe<UploadFileFiltersInput>>>;
  caption?: InputMaybe<StringFilterInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  ext?: InputMaybe<StringFilterInput>;
  folder?: InputMaybe<UploadFolderFiltersInput>;
  folderPath?: InputMaybe<StringFilterInput>;
  formats?: InputMaybe<JsonFilterInput>;
  hash?: InputMaybe<StringFilterInput>;
  height?: InputMaybe<IntFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  mime?: InputMaybe<StringFilterInput>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<UploadFileFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<UploadFileFiltersInput>>>;
  previewUrl?: InputMaybe<StringFilterInput>;
  provider?: InputMaybe<StringFilterInput>;
  provider_metadata?: InputMaybe<JsonFilterInput>;
  size?: InputMaybe<FloatFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
  url?: InputMaybe<StringFilterInput>;
  width?: InputMaybe<IntFilterInput>;
};

export type UploadFileInput = {
  alternativeText?: InputMaybe<Scalars['String']['input']>;
  caption?: InputMaybe<Scalars['String']['input']>;
  ext?: InputMaybe<Scalars['String']['input']>;
  folder?: InputMaybe<Scalars['ID']['input']>;
  folderPath?: InputMaybe<Scalars['String']['input']>;
  formats?: InputMaybe<Scalars['JSON']['input']>;
  hash?: InputMaybe<Scalars['String']['input']>;
  height?: InputMaybe<Scalars['Int']['input']>;
  mime?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  previewUrl?: InputMaybe<Scalars['String']['input']>;
  provider?: InputMaybe<Scalars['String']['input']>;
  provider_metadata?: InputMaybe<Scalars['JSON']['input']>;
  size?: InputMaybe<Scalars['Float']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  width?: InputMaybe<Scalars['Int']['input']>;
};

export type UploadFileRelationResponseCollection = {
  __typename?: 'UploadFileRelationResponseCollection';
  data: Array<UploadFileEntity>;
};

export type UploadFolder = {
  __typename?: 'UploadFolder';
  children?: Maybe<UploadFolderRelationResponseCollection>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  files?: Maybe<UploadFileRelationResponseCollection>;
  name: Scalars['String']['output'];
  parent?: Maybe<UploadFolderEntityResponse>;
  path: Scalars['String']['output'];
  pathId: Scalars['Int']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};


export type UploadFolderChildrenArgs = {
  filters?: InputMaybe<UploadFolderFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type UploadFolderFilesArgs = {
  filters?: InputMaybe<UploadFileFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type UploadFolderEntity = {
  __typename?: 'UploadFolderEntity';
  attributes?: Maybe<UploadFolder>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type UploadFolderEntityResponse = {
  __typename?: 'UploadFolderEntityResponse';
  data?: Maybe<UploadFolderEntity>;
};

export type UploadFolderEntityResponseCollection = {
  __typename?: 'UploadFolderEntityResponseCollection';
  data: Array<UploadFolderEntity>;
  meta: ResponseCollectionMeta;
};

export type UploadFolderFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<UploadFolderFiltersInput>>>;
  children?: InputMaybe<UploadFolderFiltersInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  files?: InputMaybe<UploadFileFiltersInput>;
  id?: InputMaybe<IdFilterInput>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<UploadFolderFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<UploadFolderFiltersInput>>>;
  parent?: InputMaybe<UploadFolderFiltersInput>;
  path?: InputMaybe<StringFilterInput>;
  pathId?: InputMaybe<IntFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type UploadFolderInput = {
  children?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  files?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  name?: InputMaybe<Scalars['String']['input']>;
  parent?: InputMaybe<Scalars['ID']['input']>;
  path?: InputMaybe<Scalars['String']['input']>;
  pathId?: InputMaybe<Scalars['Int']['input']>;
};

export type UploadFolderRelationResponseCollection = {
  __typename?: 'UploadFolderRelationResponseCollection';
  data: Array<UploadFolderEntity>;
};

export type UsersPermissionsCreateRolePayload = {
  __typename?: 'UsersPermissionsCreateRolePayload';
  ok: Scalars['Boolean']['output'];
};

export type UsersPermissionsDeleteRolePayload = {
  __typename?: 'UsersPermissionsDeleteRolePayload';
  ok: Scalars['Boolean']['output'];
};

export type UsersPermissionsLoginInput = {
  identifier: Scalars['String']['input'];
  password: Scalars['String']['input'];
  provider?: Scalars['String']['input'];
};

export type UsersPermissionsLoginPayload = {
  __typename?: 'UsersPermissionsLoginPayload';
  jwt?: Maybe<Scalars['String']['output']>;
  user: UsersPermissionsMe;
};

export type UsersPermissionsMe = {
  __typename?: 'UsersPermissionsMe';
  blocked?: Maybe<Scalars['Boolean']['output']>;
  confirmed?: Maybe<Scalars['Boolean']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  role?: Maybe<UsersPermissionsMeRole>;
  username: Scalars['String']['output'];
};

export type UsersPermissionsMeRole = {
  __typename?: 'UsersPermissionsMeRole';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  type?: Maybe<Scalars['String']['output']>;
};

export type UsersPermissionsPasswordPayload = {
  __typename?: 'UsersPermissionsPasswordPayload';
  ok: Scalars['Boolean']['output'];
};

export type UsersPermissionsPermission = {
  __typename?: 'UsersPermissionsPermission';
  action: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  role?: Maybe<UsersPermissionsRoleEntityResponse>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type UsersPermissionsPermissionEntity = {
  __typename?: 'UsersPermissionsPermissionEntity';
  attributes?: Maybe<UsersPermissionsPermission>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type UsersPermissionsPermissionFiltersInput = {
  action?: InputMaybe<StringFilterInput>;
  and?: InputMaybe<Array<InputMaybe<UsersPermissionsPermissionFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  not?: InputMaybe<UsersPermissionsPermissionFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<UsersPermissionsPermissionFiltersInput>>>;
  role?: InputMaybe<UsersPermissionsRoleFiltersInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type UsersPermissionsPermissionRelationResponseCollection = {
  __typename?: 'UsersPermissionsPermissionRelationResponseCollection';
  data: Array<UsersPermissionsPermissionEntity>;
};

export type UsersPermissionsRegisterInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type UsersPermissionsRole = {
  __typename?: 'UsersPermissionsRole';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  permissions?: Maybe<UsersPermissionsPermissionRelationResponseCollection>;
  type?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  users?: Maybe<UsersPermissionsUserRelationResponseCollection>;
};


export type UsersPermissionsRolePermissionsArgs = {
  filters?: InputMaybe<UsersPermissionsPermissionFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type UsersPermissionsRoleUsersArgs = {
  filters?: InputMaybe<UsersPermissionsUserFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type UsersPermissionsRoleEntity = {
  __typename?: 'UsersPermissionsRoleEntity';
  attributes?: Maybe<UsersPermissionsRole>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type UsersPermissionsRoleEntityResponse = {
  __typename?: 'UsersPermissionsRoleEntityResponse';
  data?: Maybe<UsersPermissionsRoleEntity>;
};

export type UsersPermissionsRoleEntityResponseCollection = {
  __typename?: 'UsersPermissionsRoleEntityResponseCollection';
  data: Array<UsersPermissionsRoleEntity>;
  meta: ResponseCollectionMeta;
};

export type UsersPermissionsRoleFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<UsersPermissionsRoleFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  description?: InputMaybe<StringFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<UsersPermissionsRoleFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<UsersPermissionsRoleFiltersInput>>>;
  permissions?: InputMaybe<UsersPermissionsPermissionFiltersInput>;
  type?: InputMaybe<StringFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
  users?: InputMaybe<UsersPermissionsUserFiltersInput>;
};

export type UsersPermissionsRoleInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  permissions?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  type?: InputMaybe<Scalars['String']['input']>;
  users?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};

export type UsersPermissionsUpdateRolePayload = {
  __typename?: 'UsersPermissionsUpdateRolePayload';
  ok: Scalars['Boolean']['output'];
};

export type UsersPermissionsUser = {
  __typename?: 'UsersPermissionsUser';
  blocked?: Maybe<Scalars['Boolean']['output']>;
  confirmed?: Maybe<Scalars['Boolean']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  email: Scalars['String']['output'];
  provider?: Maybe<Scalars['String']['output']>;
  role?: Maybe<UsersPermissionsRoleEntityResponse>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  username: Scalars['String']['output'];
};

export type UsersPermissionsUserEntity = {
  __typename?: 'UsersPermissionsUserEntity';
  attributes?: Maybe<UsersPermissionsUser>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type UsersPermissionsUserEntityResponse = {
  __typename?: 'UsersPermissionsUserEntityResponse';
  data?: Maybe<UsersPermissionsUserEntity>;
};

export type UsersPermissionsUserEntityResponseCollection = {
  __typename?: 'UsersPermissionsUserEntityResponseCollection';
  data: Array<UsersPermissionsUserEntity>;
  meta: ResponseCollectionMeta;
};

export type UsersPermissionsUserFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<UsersPermissionsUserFiltersInput>>>;
  blocked?: InputMaybe<BooleanFilterInput>;
  confirmationToken?: InputMaybe<StringFilterInput>;
  confirmed?: InputMaybe<BooleanFilterInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  email?: InputMaybe<StringFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  not?: InputMaybe<UsersPermissionsUserFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<UsersPermissionsUserFiltersInput>>>;
  password?: InputMaybe<StringFilterInput>;
  provider?: InputMaybe<StringFilterInput>;
  resetPasswordToken?: InputMaybe<StringFilterInput>;
  role?: InputMaybe<UsersPermissionsRoleFiltersInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
  username?: InputMaybe<StringFilterInput>;
};

export type UsersPermissionsUserInput = {
  blocked?: InputMaybe<Scalars['Boolean']['input']>;
  confirmationToken?: InputMaybe<Scalars['String']['input']>;
  confirmed?: InputMaybe<Scalars['Boolean']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  provider?: InputMaybe<Scalars['String']['input']>;
  resetPasswordToken?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['ID']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type UsersPermissionsUserRelationResponseCollection = {
  __typename?: 'UsersPermissionsUserRelationResponseCollection';
  data: Array<UsersPermissionsUserEntity>;
};
