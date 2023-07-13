import { delay } from '@xylabs/delay'
import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'

import { MountPathAndMiddleware } from '../../types'

const handleStatusCode: RequestHandler = (req, res, _next) => {
  const { code } = req.params
  res.status(parseInt(code)).send(`Status code ${code}`)
  return
}

const handleSyncThrow: RequestHandler = (_req, _res, _next) => {
  throw new Error('This is a synchronous error')
}
const handleAsyncThrow: RequestHandler = asyncHandler(async (_req, _res, _next) => {
  await Promise.resolve()
  throw new Error('This is an asynchronous error')
})

const handleTimeout: RequestHandler = asyncHandler(async (req, res, _next) => {
  const { timeout } = req.params
  const time = parseInt(timeout)
  await delay(time)
  res.status(StatusCodes.OK).send()
  return
})

/**
 * Middleware for augmenting HTML metadata for debug routes
 */
export const statusCodeHandler: MountPathAndMiddleware = ['get', ['/debug/statusCode/:code', handleStatusCode]]
export const syncThrowHandler: MountPathAndMiddleware = ['get', ['/debug/sync/throw', handleSyncThrow]]
export const asyncThrowHandler: MountPathAndMiddleware = ['get', ['/debug/async/throw', handleAsyncThrow]]
export const timeoutHandler: MountPathAndMiddleware = ['get', ['/debug/timeout/:timeout', handleTimeout]]
export const debugRoutes = [statusCodeHandler, syncThrowHandler, asyncThrowHandler, timeoutHandler]
