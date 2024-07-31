import { generateEnvVarHelpers } from '../../../env/index.js'

export const { hasEnvVar: hasFacebookAppId, tryGetEnvVar: tryGetFacebookAppId, getEnvVar: getFacebookAppId } = generateEnvVarHelpers('FB_APP_ID')
