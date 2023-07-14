import { Browser, launch, Viewport } from 'puppeteer'

import { getBrowserArgs } from './getBrowserArgs'
import { getUserDataDir } from './getUserDataDir'
import { defaultViewportSize } from './ViewPortSize'

export const viewPortDefaults: Viewport = {
  ...defaultViewportSize,
  deviceScaleFactor: 1,
  hasTouch: false,
  isLandscape: false,
  isMobile: true, // So we can render as lean as possible
}

const waitForInitialPage = false

// Disable warning for using deprecated headless mode as headless: 'new' is measurably slower
// https://github.com/puppeteer/puppeteer/blob/159513c8dbe2c9f51aa37dbe531d52b5daf1e106/packages/puppeteer-core/src/node/ChromeLauncher.ts#L53
process.env.PUPPETEER_DISABLE_HEADLESS_WARNING = 'true'

export const useBrowser = async (viewport: Viewport = viewPortDefaults): Promise<Browser> => {
  const defaultViewport: Viewport = { ...viewPortDefaults, ...viewport }
  const browser = await launch({
    args: getBrowserArgs(),
    defaultViewport,
    devtools: false,
    headless: true,
    ignoreHTTPSErrors: true,
    // slowMo: 0,
    userDataDir: getUserDataDir(),
    waitForInitialPage,
  })
  return browser
}
