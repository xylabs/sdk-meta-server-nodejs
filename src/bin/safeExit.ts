export const safeExit = (func: any) => {
  try {
    func()
  } catch (ex) {
    const error = ex as any
    process.exit(error.code)
  }
}
