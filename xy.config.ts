import { XyTsupConfig } from '@xylabs/ts-scripts-yarn3'
const config: XyTsupConfig = {
  compile: {
    browser: {
      src: false,
    },
    entryMode: 'all',
    node: {
      src: {},
    },
  },
}

// eslint-disable-next-line import/no-default-export
export default config
