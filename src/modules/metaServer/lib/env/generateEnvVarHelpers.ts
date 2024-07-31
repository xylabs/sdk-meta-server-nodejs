import { getEnvVar } from './getEnvVar.js'
import { hasEnvVar } from './hasEnvVar.js'
import { tryGetEnvVar } from './tryGetEnvVar.js'

/**
 * Helper methods for interacting with an ENV VAR
 */
export interface EnvVarHelpers {
  /**
   * Returns the value of the ENV VAR or throws if not defined
   * @returns The value of the ENV VAR
   */
  getEnvVar: () => string
  /**
   * Checks if the FB_APP_SECRET environment variable is defined
   * @returns true if the FB_APP_SECRET environment variable is defined
   */
  hasEnvVar: () => boolean
  /**
   * Returns the value of the ENV VAR or undefined if not defined
   * @returns The value of the ENV VAR or undefined if not defined
   */
  tryGetEnvVar: () => string | undefined
}

/**
 * Generates helpers for interacting with a specific ENV VAR
 * @param envVar The ENV VAR to generate helpers for
 * @returns The helpers for interacting with the ENV VAR
 */
export const generateEnvVarHelpers = (envVar: string): EnvVarHelpers => {
  return {
    getEnvVar: () => getEnvVar(envVar),
    hasEnvVar: () => hasEnvVar(envVar),
    tryGetEnvVar: () => tryGetEnvVar(envVar),
  }
}
