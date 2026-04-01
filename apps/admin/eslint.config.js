import { defineConfig } from 'eslint/config'
import baseConfig from '@eco-iguassu/eslint-config'
import reactConfig from '@eco-iguassu/eslint-config/react'

export default defineConfig(
  { ignores: ['dist/**', 'build/**'] },
  ...baseConfig,
  ...reactConfig,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
)
