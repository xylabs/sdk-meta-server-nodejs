/**
 * Gets the value of an environment variable
 * @returns the value of the environment variable
 */
export const tryGetEnvVar = (envVar: string): string | undefined => process.env?.[envVar]
