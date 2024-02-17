import { PuppeteerLifeCycleEvent } from 'puppeteer'

export const timeout: number = 10_000
export const waitUntil: PuppeteerLifeCycleEvent | PuppeteerLifeCycleEvent[] = 'domcontentloaded'
