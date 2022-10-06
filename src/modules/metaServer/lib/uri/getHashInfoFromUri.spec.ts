import { getHashInfoFromUri } from './getHashInfoFromUri'

describe('getHashInfoFromUri', () => {
  describe('with valid URI', () => {
    const uris = [
      'https://beta.explore.xyo.network/archive/temp/block/hash/18b79aa80de2bcc7287fd0577a5c2caee47a37fd4ac75a252e4bc05aeddd7fbb?network=kerplunk',
      'https://explore.xyo.network/archive/temp/block/hash/ce9d1723d3f501abc980c4f48248c11c9689051d9a2010d521e4ee484b260436?network=main',
      '/archive/temp/block/hash/ce9d1723d3f501abc980c4f48248c11c9689051d9a2010d521e4ee484b260436?network=main',
      'http://locahost:8080/archive/temp/payload/hash/62378096c541bda4a150643314fb0ed85d6f964023452f586d0e5c74db08d852',
    ]
    it.each(uris)('gets hash info from URI', (uri) => {
      const info = getHashInfoFromUri(uri)
      expect(info.archive).toBeTruthy()
      expect(info.hash).toBeTruthy()
      expect(info.type).toBeTruthy()
    })
  })
  describe('when missing', () => {
    const domainUris = [
      'https://explore.xyo.network/?network=main',
      'https://beta.explore.xyo.network/?network=main',
      'https://explore.xyo.network/?network=kerplunk',
      'https://beta.explore.xyo.network/?network=kerplunk',
    ]
    const huriUris = [
      '/ce9d1723d3f501abc980c4f48248c11c9689051d9a2010d521e4ee484b260436?network=main',
      'https://explore.xyo.network/ce9d1723d3f501abc980c4f48248c11c9689051d9a2010d521e4ee484b260436',
      'https://explore.xyo.network/ce9d1723d3f501abc980c4f48248c11c9689051d9a2010d521e4ee484b260436?network=main',
      'https://explore.xyo.network/ce9d1723d3f501abc980c4f48248c11c9689051d9a2010d521e4ee484b260436?network=kerplunk',
      'https://beta.explore.xyo.network/ce9d1723d3f501abc980c4f48248c11c9689051d9a2010d521e4ee484b260436',
      'https://beta.explore.xyo.network/ce9d1723d3f501abc980c4f48248c11c9689051d9a2010d521e4ee484b260436?network=main',
      'https://beta.explore.xyo.network/ce9d1723d3f501abc980c4f48248c11c9689051d9a2010d521e4ee484b260436?network=kerplunk',
    ]
    describe('archive', () => {
      const uris = [
        ...domainUris,
        ...huriUris,
        'https://beta.explore.xyo.network/archive',
        'https://explore.xyo.network/archive/?network=main',
        'https://explore.xyo.network/schema/network.xyo.payload',
      ]
      it.each(uris)('returns undefined', (uri) => {
        const info = getHashInfoFromUri(uri)
        expect(info.archive).toBeUndefined()
      })
    })
    describe('hash', () => {
      const uris = [
        ...domainUris,
        ...huriUris,
        'https://beta.explore.xyo.network/archive/temp',
        'https://explore.xyo.network/archive/temp/?network=main',
        'https://explore.xyo.network/schema/network.xyo.payload',
        'https://beta.explore.xyo.network/archive/temp/payload/',
        'https://explore.xyo.network/archive/temp/block/',
        'https://beta.explore.xyo.network/archive/temp/payload/?network=kerplunk',
        'https://explore.xyo.network/archive/temp/block/?network=main',
        '/archive/temp/payload/schema',
        '/archive/temp/payload/schema/stats',
        '/archive/temp/payload/schema/:schema',
        '/archive/temp/payload/schema/:schema/stats',
        '/archive/temp/payload/schema/:schema/recent/limit',
      ]
      it.each(uris)('returns undefined', (uri) => {
        const info = getHashInfoFromUri(uri)
        expect(info.hash).toBeUndefined()
      })
    })
    describe('type', () => {
      const uris = [
        ...domainUris,
        ...huriUris,
        'https://beta.explore.xyo.network/archive/temp',
        'https://explore.xyo.network/archive/temp/?network=main',
        'https://explore.xyo.network/schema/network.xyo.payload',
      ]
      it.each(uris)('returns undefined', (uri) => {
        const info = getHashInfoFromUri(uri)
        expect(info.type).toBeUndefined()
      })
    })
  })
})
