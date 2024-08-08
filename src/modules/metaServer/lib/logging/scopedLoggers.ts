import { ScopedLogFunction } from './ScopedLogFunction.ts'

type ConsoleLoggerMethod = keyof Pick<Console, 'log' | 'error' | 'warn' | 'info' | 'debug'>

/**
 * Logs a log message to the console
 * @param message The message to log
 * @param scopes The scopes to log the message under
 */
const scopedLoggerWithVerbosity = (verbosity: ConsoleLoggerMethod): ScopedLogFunction => {
  const logFunction: ScopedLogFunction = (message: string, scopes: string[] = []) => {
    const prefix = scopes.length > 0 ? `[${scopes.join('][')}]` : ''
    console[verbosity](`${prefix}: ${message}`)
  }
  return logFunction
}

/**
 * Logs a debug message to the console
 * @param message The message to log
 * @param scopes The scopes to log the message under
 */
export const debug: ScopedLogFunction = scopedLoggerWithVerbosity('debug')

/**
 * Logs an info message to the console
 * @param message The message to log
 * @param scopes The scopes to log the message under
 */
export const info: ScopedLogFunction = scopedLoggerWithVerbosity('info')

/**
 * Logs a log message to the console
 * @param message The message to log
 * @param scopes The scopes to log the message under
 */
export const log: ScopedLogFunction = scopedLoggerWithVerbosity('log')

/**
 * Logs a warning message to the console
 * @param message The message to log
 * @param scopes The scopes to log the message under
 */
export const warn: ScopedLogFunction = scopedLoggerWithVerbosity('warn')

/**
 * Logs an error message to the console
 * @param message The message to log
 * @param scopes The scopes to log the message under
 */
export const error: ScopedLogFunction = scopedLoggerWithVerbosity('error')
