import { PuppeteerLifeCycleEvent } from 'puppeteer'

export const timeout: number = 10000
export const waitUntil: PuppeteerLifeCycleEvent | PuppeteerLifeCycleEvent[] = 'domcontentloaded'
