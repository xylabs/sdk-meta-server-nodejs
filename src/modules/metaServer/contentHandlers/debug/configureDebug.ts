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

const handleThrow: RequestHandler = (req, res, _next) => {
  const { code } = req.params
  res.status(parseInt(code)).send(`Status code ${code}`)
  return
}

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
export const statusCodeHandler = (): MountPathAndMiddleware => ['get', ['/debug/statusCode/:code', handleStatusCode]]
