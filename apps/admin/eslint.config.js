import { defineConfig } from 'eslint/config'
import baseConfig from '@launchpad/eslint-config'
import reactConfig from '@launchpad/eslint-config/react'

export default defineConfig(
  { ignores: ['dist/**', 'build/**', 'src/app/routeTree.gen.ts'] },
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
  {
    // TanStack Router route files always export `Route` alongside page components —
    // this is the intended pattern and not a fast-refresh concern for route-level files.
    files: ['src/app/routes/**'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    // DataTable uses `useReactTable` from TanStack Table v8, which is incompatible with
    // React Compiler memoization. The "use no memo" directive in the file opts out of
    // compilation explicitly. Remove when upgrading to TanStack Table v9 (RC Compiler-compatible).
    files: ['src/components/shared/DataTable/**'],
    rules: {
      'react-hooks/incompatible-library': 'off',
    },
  },
)
