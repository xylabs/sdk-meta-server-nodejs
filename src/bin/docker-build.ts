import { execSync } from 'node:child_process'

import { getFlagsString } from './getFlags.ts'
import { safeExit } from './safeExit.ts'

safeExit(async () => {
  console.log(`Docker build [${process.cwd()}]`)
  const flagString = await getFlagsString()
  // This is the path to the Dockerfile for any project which depends on this
  // library relative to the root of the dependent
  const command = [
    'docker',
    'build',
    '-f',
    './node_modules/@xylabs/meta-server/Dockerfile',
    flagString,
    '.',
  ].join(' ')
  console.log(command)
  execSync(command, { stdio: 'inherit' })
})
