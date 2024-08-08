import { generateEnvVarHelpers } from '../../env/index.ts'

export const {
  hasEnvVar: hasSecretAccessKey,
  tryGetEnvVar: tryGetSecretAccessKey,
  getEnvVar: getSecretAccessKey,
} = generateEnvVarHelpers('AWS_SECRET_ACCESS_KEY')
