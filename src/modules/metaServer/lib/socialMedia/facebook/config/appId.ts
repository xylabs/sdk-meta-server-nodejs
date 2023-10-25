import { generateEnvVarHelpers } from '../../../env'

export const { hasEnvVar: hasFacebookAppId, tryGetEnvVar: tryGetFacebookAppId, getEnvVar: getFacebookAppId } = generateEnvVarHelpers('FB_APP_ID')
