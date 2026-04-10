import { defineConfig } from 'eslint/config'
import baseConfig from '@launchpad/eslint-config'

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
