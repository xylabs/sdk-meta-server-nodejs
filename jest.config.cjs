const generateJestConfig = ({ esModules }) => {
  const esModulesList = Array.isArray(esModules) ? esModules.join('|') : esModules
  return {
    coveragePathIgnorePatterns: ['src/modules/metaServer/server/index.ts'],
    moduleNameMapper: {
      '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    preset: 'ts-jest/presets/default-esm',
    setupFiles: ['dotenv/config'],
    setupFilesAfterEnv: ['jest-sorted', 'jest-extended/all'],
    snapshotSerializers: ['jest-serializer-html'],
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
    testTimeout: 20000,
    transform: {
      [`(${esModulesList}).+\\.js$`]: 'babel-jest',
      '^.+\\.tsx?$': [
        'ts-jest',
        {
          tsconfig: 'tsconfig.test.json',
        },
      ],
    },
    transformIgnorePatterns: [`./node_modules/(?!${esModulesList})`],
  }
}

// eslint-disable-next-line no-undef
module.exports = generateJestConfig({ esModules: ['is-ip', 'ip-regex', 'lodash-es'] })
