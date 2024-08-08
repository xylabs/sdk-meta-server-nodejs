import { generateEnvVarHelpers } from '../../../env/index.ts'

export const {
  hasEnvVar: hasFacebookAppSecret,
  tryGetEnvVar: tryGetFacebookAppSecret,
  getEnvVar: getFacebookAppSecret,
} = generateEnvVarHelpers('FB_APP_SECRET')
