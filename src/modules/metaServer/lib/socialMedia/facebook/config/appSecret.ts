import { generateEnvVarHelpers } from '../../../env'

export const {
  hasEnvVar: hasFacebookAppSecret,
  tryGetEnvVar: tryGetFacebookAppSecret,
  getEnvVar: getFacebookAppSecret,
} = generateEnvVarHelpers('FB_APP_SECRET')
