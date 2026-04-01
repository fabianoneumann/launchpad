import { defineConfig } from 'eslint/config'
import baseConfig from '@eco-iguassu/eslint-config'

export default defineConfig(
  { ignores: ['dist/**', 'build/**', 'src/generated/**'] },
  ...baseConfig,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
)
