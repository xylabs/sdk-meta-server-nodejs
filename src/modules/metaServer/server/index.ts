import { config } from 'dotenv'
config()

import express, { Express } from 'express'

import { ApplicationMiddlewareOptions } from '../types'
import { addContentHandlers } from './addContentHandlers'
import { addMiddleware } from './addMiddleware'

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
