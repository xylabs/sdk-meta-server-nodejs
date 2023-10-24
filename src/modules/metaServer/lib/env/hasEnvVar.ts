/**
 * Checks if the environment variable is defined
 * @returns true if the environment variable is defined
 */
export const hasEnvVar = (envVar: string): boolean => process.env?.[envVar] !== undefined
