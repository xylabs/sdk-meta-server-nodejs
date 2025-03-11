import type {
  NextFunction, Request, Response,
} from 'express'

export const globalDefaultCaching = (req: Request, res: Response, next: NextFunction) => {
  res.set({
    'Cache-Control': 'public, max-age=60, stale-while-revalidate=30, stale-if-error=300',
    'Expires': new Date(Date.now() + 60 * 1000).toUTCString(), // Expires in 60 seconds
  })
  next()
}
