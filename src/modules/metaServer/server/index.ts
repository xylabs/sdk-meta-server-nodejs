import { config } from 'dotenv'
config()

import type { Express } from 'express'
import express from 'express'

import type { ApplicationMiddlewareOptions } from '../types/index.ts'
import { addContentHandlers } from './addContentHandlers.ts'
import { addMiddleware } from './addMiddleware.ts'

const defaultDirectory = process.env.SERVE_DIRECTORY || './build'

export const getApp = (baseDir = defaultDirectory): Express => {
  const opts: ApplicationMiddlewareOptions = { baseDir }
  const app = express()
  addMiddleware(app)
  addContentHandlers(app, opts)
  return app
}

export const server = (port = 80, baseDir = defaultDirectory) => {
  const app = getApp(baseDir)
  const server = app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
  })
  // This is higher than normal because we rely on CloudFront to timeout
  // before this timeout is ever reached.
  server.setTimeout(20_000)
  return server
}
