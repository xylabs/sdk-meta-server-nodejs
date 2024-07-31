import { generateEnvVarHelpers } from '../../env/index.js'

export const { hasEnvVar: hasAccessKeyId, tryGetEnvVar: tryGetAccessKeyId, getEnvVar: getAccessKeyId } = generateEnvVarHelpers('AWS_ACCESS_KEY_ID')
