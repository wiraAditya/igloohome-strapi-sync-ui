import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  // Use local file instead of URL since automatic schema pull is disabled
  schema: './schema.graphql',
  documents: ['app/**/*.ts', 'app/**/*.vue'],
  ignoreNoDocuments: true,
  generates: {
    './app/gql/': {
      preset: 'client',
      plugins: [],
      config: {
        useTypeImports: true
      }
    }
  }
}

export default config
