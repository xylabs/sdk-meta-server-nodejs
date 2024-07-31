import { delay } from '@xylabs/delay'
import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'

import { MountPathAndMiddleware } from '../../types/index.js'

const handleStatusCode: RequestHandler = (req, res, _next) => {
  const { code } = req.params
  res.sendStatus(Number.parseInt(code))
  return
}

const handleSyncThrow: RequestHandler = (_req, _res, _next) => {
  throw new Error('This is a synchronous error')
}
// eslint-disable-next-line @typescript-eslint/no-misused-promises
const handleAsyncThrow: RequestHandler = asyncHandler(async (_req, _res, _next) => {
  await Promise.resolve()
  throw new Error('This is an asynchronous error')
})

// eslint-disable-next-line @typescript-eslint/no-misused-promises
const handleTimeout: RequestHandler = asyncHandler(async (req, res, _next) => {
  const { timeout } = req.params
  const time = Number.parseInt(timeout)
  await delay(time)
  res.sendStatus(StatusCodes.OK)
  return
})

/**
 * Middleware for augmenting HTML metadata for debug routes
 */
const statusCodeHandler: MountPathAndMiddleware = ['get', ['/debug/statusCode/:code', handleStatusCode]]
const syncThrowHandler: MountPathAndMiddleware = ['get', ['/debug/sync/throw', handleSyncThrow]]
const asyncThrowHandler: MountPathAndMiddleware = ['get', ['/debug/async/throw', handleAsyncThrow]]
const timeoutHandler: MountPathAndMiddleware = ['get', ['/debug/timeout/:timeout', handleTimeout]]
export const debugRoutes = [statusCodeHandler, syncThrowHandler, asyncThrowHandler, timeoutHandler]
