import { expect } from 'chai'

import RpcClient from '../src'
import bitcoindConfig from './config/bitcoind.json'

describe('RpcClient', () => {
  let bitcoind

  beforeEach(() => {
    bitcoind = new RpcClient(bitcoindConfig)
  })

  it('call getInfo with callback', () => {
    return new Promise((resolve, reject) => {
      bitcoind.getInfo((err, ret) => {
        try {
          expect(err).to.be.null
          expect(ret.error).to.be.null
          expect(ret.result).to.be.an('Object')
          resolve()
        } catch (err) {
          reject(err)
        }
      })
    })
  })

  it('call getInfo', async () => {
    let ret = await bitcoind.getInfo()
    expect(ret.error).to.be.null
    expect(ret.result).to.be.an('Object')
  })

  it('call getinfo', async () => {
    let ret = await bitcoind.getinfo()
    expect(ret.error).to.be.null
    expect(ret.result).to.be.an('Object')
  })

  it('call getinfo in cmd', async () => {
    let ret = await bitcoind.cmd('getinfo')
    expect(ret.error).to.be.null
    expect(ret.result).to.be.an('Object')
  })

  it('batch call', async () => {
    let ret = await bitcoind.batch([
      {method: 'getinfo'},
      {method: 'getbestblockhash'}
    ])
    expect(ret).to.be.an('Array').and.to.have.length(2)
    expect(ret[0].error).to.be.null
    expect(ret[0].result).to.be.an('Object')
    expect(ret[1].error).to.be.null
    expect(ret[1].result).to.be.a('String').and.to.have.length(64)
  })

  it('batch interface', async () => {
    let batch = bitcoind.batch()
    batch.getinfo()
    batch.clear()
    batch.getinfo()
    batch.getBestBlockHash()

    let ret = await batch.call()
    expect(ret).to.be.an('Array')
    expect(ret[0].error).to.be.null
    expect(ret[0].result).to.be.an('Object')
    expect(ret[1].error).to.be.null
    expect(ret[1].result).to.be.a('String').and.to.have.length(64)

    expect(::batch.getinfo).to.throw(Error)
  })
})
