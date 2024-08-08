import { server } from './server/index.ts'

export const metaServer = (port?: number) => {
  server(port)
}
