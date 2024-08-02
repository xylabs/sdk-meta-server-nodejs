type Function = () => void
export const safeExit = (func: Function) => {
  try {
    func()
  } catch {
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(1)
  }
}
