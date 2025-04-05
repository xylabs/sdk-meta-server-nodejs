import { minimatch } from 'minimatch'

import type { RouteMatcher } from './RouteMatcher.ts'

/**
 * Higher order function which creates route matchers
 * from a list of Glob Patterns
 * @param patterns Glob patterns for route paths to match against
 * @returns
 */
export const createGlobMatcher = (patterns: string[] = []): RouteMatcher => {
  const matchers = patterns.map(pattern => (str: string) => minimatch(str, pattern))
  return (route: string) => matchers.some(matcher => matcher(route))
}
