import type { XyTsupConfig } from '@xylabs/ts-scripts-yarn3'
const config: XyTsupConfig = {
  compile: {
    browser: { src: false },
    entryMode: 'all',
    node: { src: {} },
  },
}

export default config
