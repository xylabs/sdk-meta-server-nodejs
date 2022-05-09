import yargs  from 'yargs'

/**
 * Determines the flags for the supplied command (without
 * the command itself)
 * @returns The flags supplied with the command invocation
 */
const getFlags = async () => {
  const { _, $0, ...flags } = await yargs.parserConfiguration({
    "camel-case-expansion": false,
  }).argv
  return flags
}

/**
 * Return the string corresponding to the CLI flag
 * name/value tuple. This method handles the case
 * for flags that were supplied multiple times by
 * generating the appropriate string for each
 * supplied flag.
 * @param {string} name Flag name
 * @param {string|string[]} value Flag value(s) 
 * @returns 
 */
export const getFlagFromProperty = (name: string, value: any): any => {
  const dash = name.length === 1 ? '-' : '--'
  return Array.isArray(value) ?
    value.map(v => { return getFlagFromProperty(name, v) }).join(' ') :
    `${dash}${name} ${value}`
}

/**
 * Parses the supplied CLI flags and returns them as a string
 * to be fed to subsequent commands
 * @returns The supplied CLI flags as a string
 */
export const getFlagsString = async () => {
  const flags = await getFlags()
  const resp = Object
    .keys(flags)
    .map(k => { return { flag: k, value: flags[k] } })
    .map(curr => { return getFlagFromProperty(curr.flag, curr.value) })
    .join(' ')
  return resp
}