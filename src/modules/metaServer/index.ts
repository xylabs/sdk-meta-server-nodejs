import { server } from './server/index.js'

export const metaServer = (port?: number) => {
  server(port)
}
