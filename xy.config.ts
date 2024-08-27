import type { XyTsupConfig } from '@xylabs/ts-scripts-yarn3'
const config: XyTsupConfig = {
  compile: {
    browser: {},
    neutral: {},
    node: { src: { entry: ['./src/bin/*.ts', './src/index.ts'] } },
  },
}

export default config
