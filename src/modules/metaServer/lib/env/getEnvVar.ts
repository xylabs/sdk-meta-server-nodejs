import { assertEx } from '@xylabs/assert'

/**
 * Gets the value of an environment variable, throws if not defined
 * @returns the value of the environment variable
 */
export const getEnvVar = (envVar: string): string => assertEx(process.env?.[envVar], () => `Error: Missing value for ENV VAR ${envVar}`)
