import { format } from 'date-fns'
import { Browser, launch, Page, Viewport, WaitForOptions } from 'puppeteer'

import { PageRenderingOptions } from '../PageRenderingOptions'
import { defaultViewportSize } from '../ViewPortSize'

export const viewPortDefaults: Viewport = {
  ...defaultViewportSize,
  deviceScaleFactor: 1,
  hasTouch: false,
  isLandscape: false,
  isMobile: true, // So we can render as lean as possible
}

export const defaultPageRenderingOptions: PageRenderingOptions = {
  viewportSize: viewPortDefaults,
}

// https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#tips
// https://peter.sh/experiments/chromium-command-line-switches/
// https://www.bannerbear.com/blog/ways-to-speed-up-puppeteer-screenshots/
const fullArgs = [
  '--autoplay-policy=user-gesture-required',
  '--disable-2d-canvas-clip-aa', // This flag disables the antialiasing on the 2D canvas clip.
  '--disable-3d-apis', // This flag disables 3D APIs, WebGL and WebGPU.
  '--disable-accelerated-2d-canvas',
  '--disable-background-networking', // This flag disables various background network services, including extension updating, safe browsing service, upgrade detector, translate, UMA.
  '--disable-background-timer-throttling', // This flag disables timers throttling.
  '--disable-backgrounding-occluded-windows', // This flag disables the tracking of occluded windows.
  '--disable-breakpad', // This flag disables the breakpad crash reporter.
  '--disable-canvas-aa', // This flag disables the antialiasing on the HTML canvas element.
  '--disable-client-side-phishing-detection', // This flag disables the client-side phishing detection.
  '--disable-component-update',
  '--disable-composited-antialiasing', // This flag disables the antialiasing in the compositor.
  '--disable-default-apps', // This flag disables the installation of default apps.
  '--disable-dev-shm-usage', // This flag prevents Chrome from using shared memory for rendering.
  '--disable-domain-reliability',
  '--disable-extensions', // This flag disables extensions.
  '--disable-features=AudioServiceOutOfProcess',
  '--disable-features=site-per-process,TranslateUI,BlinkGenPropertyTrees', // This flag disables site per process, the translation UI, and BlinkGenPropertyTrees.
  '--disable-font-subpixel-positioning', // This flag disables subpixel font positioning, which can help save CPU resources.
  '--disable-gl-drawing-for-tests', // This flag disables the GL drawing tests.
  '--disable-gl-extensions', // This flag disables all GL extensions.
  '--disable-gpu', // This flag disables GPU hardware acceleration.
  '--disable-hang-monitor', // This flag disables the hang monitor.
  '--disable-histogram-customizer', // This flag disables custom histograms.
  '--disable-in-process-stack-traces', // This flag disables capturing of stack traces.
  '--disable-ipc-flooding-protection',
  '--disable-notifications', // to disable native notification window on Mac OS
  '--disable-offer-store-unmasked-wallet-cards',
  '--disable-popup-blocking', // This flag disables the popup blocking.
  '--disable-print-preview',
  '--disable-prompt-on-repost', // This flag disables the prompt for re-posting form data.
  '--disable-renderer-backgrounding', // This flag disables backgrounding renders.
  '--disable-setuid-sandbox', // This flag disables the SUID sandbox in Chrome, which can help in restricted environments.
  '--disable-site-isolation-trials',
  '--disable-sockets', // This flag disables the use of certain types of sockets.
  '--disable-software-rasterizer', // This flag disables the software rasterizer that is part of headless Chrome.
  '--disable-speech-api',
  '--disable-sync', // This flag disables syncing to a Google account.
  '--disable-threaded-animation', // This flag disables threaded animations.
  '--disable-threaded-scrolling', // This flag disables threaded scrolling.
  '--disable-web-security', // disabling CORS
  '--disable-webgl', // This flag disables WebGL.
  '--enable-features=NetworkService,NetworkServiceInProcess', // This flag runs the network service in the same process as the browser.
  '--force-color-profile=srgb', // This flag forces the color profile to be sRGB.
  '--hide-scrollbars',
  '--ignore-gpu-blacklist',
  '--metrics-recording-only', // This flag disables reporting to UMA, but allows local
  '--mute-audio', // This flag mutes any audio output which might not be necessary in a headless mode.
  '--no-default-browser-check',
  '--no-first-run', // This flag skips the first run experience for the browser.
  '--no-pings',
  '--no-sandbox', // This flag disables the sandbox security feature. It's necessary in some environments but use it with caution, as it can create security risks.
  '--no-zygote', // Seems to help avoid zombies https://github.com/puppeteer/puppeteer/issues/1825
  '--password-store=basic',
  '--single-process', // <- this one doesn't works in Windows
  '--ui-disable-partial-swap', // This flag disables using partial swap for compositor frame.
  '--use-gl=swiftshader', // This flag uses SwiftShader for GPU rasterization.
  '--use-mock-keychain',
]

const limitedArgs = [
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-dev-shm-usage',
  '--disable-accelerated-2d-canvas',
  '--no-first-run',
  '--no-zygote',
  '--single-process', // <- this one doesn't works in Windows
  '--disable-gpu',
]
const useLimitedArgs = true
const args = useLimitedArgs ? limitedArgs : fullArgs

const waitForInitialPage = false
const waitForOptions: WaitForOptions = {
  waitUntil: 'networkidle0',
  // waitUntil: 'networkidle2',
}
const pageGotoOptions: WaitForOptions | undefined = waitForInitialPage ? waitForOptions : undefined

// Disable warning for using deprecated headless mode as headless: 'new' is measurably slower
// https://github.com/puppeteer/puppeteer/blob/159513c8dbe2c9f51aa37dbe531d52b5daf1e106/packages/puppeteer-core/src/node/ChromeLauncher.ts#L53
process.env.PUPPETEER_DISABLE_HEADLESS_WARNING = 'true'

type GetBrowserPage = (browser: Browser) => Promise<Page>
const getFirstTab: GetBrowserPage = async (browser: Browser) => (await browser.pages())[0]
const getNewPage: GetBrowserPage = (browser: Browser) => browser.newPage()
const useFirstTab = false
const getBrowserPage = useFirstTab ? getFirstTab : getNewPage

export const usePage = async <T>(
  url: string,
  options: PageRenderingOptions | undefined = defaultPageRenderingOptions,
  pageCallback: (page: Page) => Promise<T> | T,
) => {
  if (!options) options = defaultPageRenderingOptions
  const defaultViewport: Viewport = options?.viewportSize ? { ...viewPortDefaults, ...options.viewportSize } : { ...viewPortDefaults }
  const browser = await launch({
    args,
    defaultViewport,
    devtools: false,
    headless: true,
    ignoreHTTPSErrors: true,
    // slowMo: 0,
    userDataDir: './puppeteer/cache',
    waitForInitialPage,
  })
  try {
    const page = await getBrowserPage(browser)
    void page.goto(url, pageGotoOptions)
    // await page.goto(url)
    return await pageCallback(page)
  } catch (err) {
    console.log(err)
  } finally {
    // TODO: Is is safe to background this?
    void browser.close()
  }
}
