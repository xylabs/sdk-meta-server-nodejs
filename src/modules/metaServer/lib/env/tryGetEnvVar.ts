/**
 * Gets the value of an environment variable or undefined if not defined
 * @returns the value of the environment variable or undefined if not defined
 */
export const tryGetEnvVar = (envVar: string): string | undefined => process.env?.[envVar]
