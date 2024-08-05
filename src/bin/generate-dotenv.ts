import { execSync } from 'node:child_process'

import { safeExit } from './safeExit.js'

await safeExit(() => {
  console.log(`Generate .env [${process.cwd()}]`)
  // Append the current environment to the .env (mostly for build server)
  execSync('printenv >> .env', { stdio: 'inherit' })
})
