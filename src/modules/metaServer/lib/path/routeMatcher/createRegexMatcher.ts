import { assertEx } from '@xylabs/assert'
import type { MMRegExp } from 'minimatch'
import { makeRe } from 'minimatch'

import type { RouteMatcher } from './RouteMatcher.ts'

/**
 * Higher order function which creates precompiled RegEx route matchers
 * from a list of Glob Patterns
 * @param patterns Glob patterns for route paths to match against
 * @returns
 */
export const createRegexMatcher = (patterns: string[]): RouteMatcher => {
  const regexesOrFalse = patterns.map(pattern => makeRe(pattern))
  // eslint-disable-next-line unicorn/no-array-reduce
  const invalidGlobPatternIndexes = regexesOrFalse.reduce<number[]>((acc, curr, idx) => {
    if (curr === false) acc.push(idx)
    return acc
  }, [])
  assertEx(invalidGlobPatternIndexes.length === 0, () => `Invalid glob pattern(s): ${invalidGlobPatternIndexes.map(i => patterns[i]).join(', ')}`)
  const regexes = regexesOrFalse.filter((regex): regex is MMRegExp => assertEx(regex !== false))
  return (route: string) => regexes.some(regex => regex.test(route))
}
