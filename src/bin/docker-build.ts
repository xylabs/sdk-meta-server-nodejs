import { execSync } from 'child_process'
import { safeExit } from './safeExit.js'
import { getFlagsString } from './getFlags.js'

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