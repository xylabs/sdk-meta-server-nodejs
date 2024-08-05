type Function = () => void | Promise<void>

export const safeExit = async (func: Function) => {
  try {
    await func()
  } catch {
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(1)
  }
}
