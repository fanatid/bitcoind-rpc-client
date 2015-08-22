import Methods from './methods'

/**
 * @class BatchInterface
 */
export default class BatchInterface extends Methods {
  /**
   * @constructor
   * @param {RpcClient} bitcoind
   */
  constructor (bitcoind) {
    super()

    this._bitcoind = bitcoind

    this._isCalled = false
    this._batch = []
  }

  /**
   */
  _isCalledCheck () {
    if (this._isCalled) {
      throw new Error('batch was already called!')
    }
  }

  /**
   * @param {string} method
   * @return {BatchInterface}
   */
  cmd (method, ...params) {
    this._isCalledCheck()
    this._batch.push({method: method, params: params})
    return this
  }

  /**
   * @return {BatchInterface}
   */
  clear () {
    this._isCalledCheck()
    this._batch = []
    return this
  }

  /**
   * @param {function} [callback]
   * @return {Promise.<Array.<{error: ?{code: number, message: string}, result: *}>>}
   */
  call (callback) {
    this._isCalledCheck()
    this._isCalled = true
    return this._bitcoind.batch(this._batch, callback)
  }
}
