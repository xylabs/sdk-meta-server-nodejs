import { Browser, launch, Viewport } from 'puppeteer'

import { getBrowserArgs } from './getBrowserArgs.js'
import { getUserDataDir } from './getUserDataDir.js'
import { defaultViewportSize } from './ViewPortSize.js'

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

/**
 * This method is here to allow for eventual "connection pooling" of browsers.
 * Currently, it just launches a new browser. However, it could be modified
 * to allow for the opening of new tabs in an existing browser. Ideally, we
 * would create browsers on demand and keep them open for a period of time,
 * restarting them if they become unresponsive. However, detecting unresponsive
 * browsers is not really supported by puppeteer, so we would have to implement
 * our own solution for that. If we do pool them, we should probably do it by
 * viewport size to prevent affecting other users by changing the viewport size
 * on them.
 * @param viewport Browser viewport size
 * @returns
 */
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
