import { generateEnvVarHelpers } from '../../../env/index.ts'

export const {
  hasEnvVar: hasFacebookAppId, tryGetEnvVar: tryGetFacebookAppId, getEnvVar: getFacebookAppId,
} = generateEnvVarHelpers('FB_APP_ID')
