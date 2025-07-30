import type { XyTsupConfig } from '@xylabs/ts-scripts-yarn3'
const config: XyTsupConfig = {
  compile: {
    entryMode: 'custom',
    browser: {},
    neutral: {},
    node: {
      src: {
        entry: [
          'bin/docker-build.ts',
          'bin/generate-dotenv.ts',
          'bin/getFlags.ts',
          'bin/safeExit.ts',
          'bin/start-meta.ts',
          'index.ts',
        ],
      },
    },
  },
}

export default config
