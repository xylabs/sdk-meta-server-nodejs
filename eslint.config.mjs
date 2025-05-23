import {
  typescriptConfig,
  unicornConfig,
  workspacesConfig,
  rulesConfig,
  sonarConfig,
  importConfig,
} from '@xylabs/eslint-config-flat'

export default [
  { ignores: ['.yarn', 'dist', '**/dist/**', 'build', '**/build/**', 'node_modules/**', 'public', 'storybook-static', 'eslint.config.mjs', 'bin', 'scripts', 'load.mjs', 'puppeteer' ] },
  unicornConfig,
  workspacesConfig,
  rulesConfig,
  typescriptConfig,
  importConfig,
  sonarConfig,
  {
    rules: {
      'sonarjs/prefer-single-boolean-return': ['off'],
      'sonarjs/no-hardcoded-ip': ['off'],
      'sonarjs/no-clear-text-protocols': ['off'],
      'import-x/no-unresolved': ['off'],
    },
  },
]
