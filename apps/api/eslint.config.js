import baseConfig from '@eco-iguassu/eslint-config'
import tseslint from 'typescript-eslint'

export default tseslint.config(
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
