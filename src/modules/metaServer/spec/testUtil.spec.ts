import '@xylabs/vitest-extended'

import type { Server } from 'node:http'
import Path from 'node:path'

import type { SuperTest, Test } from 'supertest'
import { agent } from 'supertest'
import { expect, test } from 'vitest'

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
