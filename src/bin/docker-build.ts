import { execSync } from 'child_process'
import { safeExit } from './safeExit'
import { getFlagsString } from './getFlags'

safeExit(() => {
  console.log(`Docker build [${process.cwd()}]`)
  // This is the path to the Dockerfile for any project which depends on this
  // library relative to the root of the dependent
  const command = [
    'docker',
    'build',
    '-f',
    './node_modules/@xylabs/meta-server/Dockerfile',
    getFlagsString(),
    '.',
  ].join(' ')
  console.log(command)
  execSync(command, { stdio: 'inherit' })
})