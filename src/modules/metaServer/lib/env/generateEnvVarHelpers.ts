import { getEnvVar } from './getEnvVar'
import { hasEnvVar } from './hasEnvVar'
import { tryGetEnvVar } from './tryGetEnvVar'

export interface EnvVarHelpers {
  getEnvVar: () => string
  hasEnvVar: () => boolean
  tryGetEnvVar: () => string | undefined
}

export const generateEnvVarHelpers = (envVar: string): EnvVarHelpers => {
  return {
    getEnvVar: () => getEnvVar(envVar),
    hasEnvVar: () => hasEnvVar(envVar),
    tryGetEnvVar: () => tryGetEnvVar(envVar),
  }
}
