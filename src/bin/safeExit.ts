/* eslint-disable unicorn/no-process-exit */
type Function = () => void | Promise<void>

export const safeExit = (func: Function) => {
  // Use an Immediately Invoked Function Expression (IIFE) to handle async execution
  (async () => {
    await func()
  })().then(() => {
    process.exit(0)
  }).catch((error) => {
    console.error('An error occurred:', error)
    process.exit(1)
  })
}
