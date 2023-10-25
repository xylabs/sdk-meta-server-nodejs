import { generateEnvVarHelpers } from '../../env'

export const {
  hasEnvVar: hasSecretAccessKey,
  tryGetEnvVar: tryGetSecretAccessKey,
  getEnvVar: getSecretAccessKey,
} = generateEnvVarHelpers('AWS_SECRET_ACCESS_KEY')
