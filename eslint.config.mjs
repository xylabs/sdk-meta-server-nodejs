// eslint.config.mjs

import {
  typescriptConfig,
  unicornConfig,
  workspacesConfig,
  rulesConfig,
  importConfig,
} from '@xylabs/eslint-config-flat'

import sonarjs from 'eslint-plugin-sonarjs'

export default [
  { ignores: ['.yarn/**', 'jest.config.cjs', '**/dist/**', 'dist', 'build/**', 'coverage', 'scripts', 'node_modules/**', 'puppeteer', '.*', 'eslint.config.mjs', 'load.mjs'] },
  unicornConfig,
  workspacesConfig,
  rulesConfig,
  {
    ...typescriptConfig,
    rules: {
      ...typescriptConfig.rules,
      '@typescript-eslint/consistent-type-imports': ['warn'],
    },
  },
  {
    ...importConfig,
    rules: {
      ...importConfig.rules,
      'import-x/no-cycle': ['warn', { maxDepth: 5 }],
    },
  },
  {
    plugins: { sonarjs },
    rules: {
      'sonarjs/deprecation': ['warn'],
    },
  },

]
