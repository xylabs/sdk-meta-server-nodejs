import { getExplorerArchivistBlockInfo } from '../getExplorerArchivistBlockInfo'

describe('getExplorerArchivistBlockInfo', () => {
  it('gets ExplorerArchivistBlockInfo from path', () => {
    const hash = '62378096c541bda4a150643314fb0ed85d6f964023452f586d0e5c74db08d852'
    const path = `http://aws-alb-123456789.us-east-1.elb.amazonaws.com:80/archive/temp/payload/hash/${hash}`
    const info = getExplorerArchivistBlockInfo(path)
    expect(info).toBeDefined()
  })
})
