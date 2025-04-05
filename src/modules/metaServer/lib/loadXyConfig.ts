import { existsSync, readFileSync } from 'node:fs'
import Path from 'node:path'

import { toJsonObject } from '@xylabs/object'

import type { XyConfig } from '../../../model/index.ts'

export const loadXyConfig = (baseDir: string, moduleName: string): XyConfig | undefined => {
  const filePath = Path.join(baseDir, 'xy.config.json')
  console.log(`[${moduleName}] Locating xy.config.json at ${filePath}`)
  if (existsSync(filePath)) {
    console.log(`[${moduleName}] Located xy.config.json`)
    // Read in config file
    console.log(`[${moduleName}] Parsing xy.config.json`)
    const xyConfig = JSON.parse(readFileSync(filePath, { encoding: 'utf8' }))
    console.log(`[${moduleName}] Parsed xy.config.json`)
    return toJsonObject(xyConfig, [], 16)
  }
}
