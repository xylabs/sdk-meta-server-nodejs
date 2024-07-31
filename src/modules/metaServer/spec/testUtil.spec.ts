import { Server } from 'node:http'
import Path from 'node:path'

import { agent, SuperTest, Test } from 'supertest'

import { getApp, server } from '../server/index.ts'

test('Spec files require tests', () => {
  expect(true).toBeTruthy()
})

const defaultBaseDir = Path.join(__dirname, 'staticFileServeDir')

export const getServer = (baseDir = defaultBaseDir): SuperTest<Test> => {
  return agent(getApp(baseDir)) as unknown as SuperTest<Test>
}

export const getServerOnPort = (port: number, baseDir = defaultBaseDir): [Server, SuperTest<Test>] => {
  const activeServer = server(port, baseDir)
  return [activeServer, agent(activeServer) as unknown as SuperTest<Test>]
}
