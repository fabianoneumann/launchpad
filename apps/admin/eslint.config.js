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
  {
    // shadcn components intentionally export both the component and variant
    // utilities (e.g. buttonVariants) for use in other components.
    // sidebar.tsx uses Math.random() inside useMemo([]) for skeleton widths — intentional, fires once on mount.
    files: ['src/components/ui/**'],
    rules: {
      'react-refresh/only-export-components': 'off',
      'react-hooks/purity': 'off',
    },
  },
)
