import http from 'http'
import https from 'https'

import Methods from './methods'
import BatchInterface from './batch'
import { asNodeCallaback } from './util'

let methodId = 0

/**
 * @class RpcClient
 */
export default class RpcClient extends Methods {
  /**
   * @constructor
   * @param {Object} opts
   * @param {string} [opts.host=127.0.0.1]
   * @param {number} [opts.port=8332]
   * @param {string} [opts.user]
   * @param {string} [opts.pass]
   * @param {boolean} [opts.ssl=false]
   * @param {boolean} [opts.sslStrict]
   * @param {string} [opts.sslCa]
   */
  constructor (opts) {
    super()

    this._opts = opts || {}
    this._opts.host = this._opts.host || '127.0.0.1'
    this._opts.port = this._opts.port || 8332
    this._opts.ssl = this._opts.ssl || false
  }

  /**
   * @param {string} key
   * @param {*} value
   * @return {RpcClient}
   */
  set (key, value) {
    this._opts[key] = value
    return this
  }

  /**
   * @param {string} key
   * @return {*}
   */
  get (key) {
    return this._opts[key]
  }

  /**
   * @param {Array.<{method: string, params: Array.<*>}>} [batch]
   * @param {function} [callback]
   * @return {(Promise.<(BatchInterface|Array.<{error: ?{code: number, message: string}, result: *}>)}
   */
  batch (batch, callback) {
    if (batch === undefined) {
      return new BatchInterface(this)
    }

    return this._call(batch, callback)
  }

  /**
   * @param {string} method
   * @return {Promise.<{error: ?{code: number, message: string}, result: *}>}
   */
  cmd (method, ...params) {
    let callback
    if (typeof params[params.length - 1] === 'function') {
      callback = params.pop()
    }

    return this._call({method: method, params: params}, callback)
  }

  /**
   * @param {(Object|Object[])} data
   * @param {function} [callback]
   * @return {Promise.<{error: ?{code: number, message: string}, result: *}>}
   */
  _call (data, callback) {
    return asNodeCallaback(new Promise((resolve, reject) => {
      let request
      if (Array.isArray(data)) {
        request = data.map((req) => {
          return {method: req.method, params: req.params || [], id: methodId++}
        })
      } else {
        request = {method: data.method, params: data.params || [], id: methodId++}
      }

      let requestJSON = JSON.stringify(request)
      let requestErrorMsg = `Bitcoin Core JSON-RPC: host=${this._opts.host} port=${this._opts.port}: `
      let requestOpts = {
        host: this._opts.host,
        port: this._opts.port,
        method: 'POST',
        path: '/',
        headers: {
          'Content-Length': requestJSON.length,
          'Content-Type': 'application/json'
        },
        agent: undefined,
        rejectUnauthorized: this._opts.ssl && this._opts.sslStrict !== false
      }

      if (this._opts.user && this._opts.pass) {
        requestOpts.auth = `${this._opts.user}:${this._opts.pass}`
      }

      if (this._opts.ssl && this._opts.sslCa) {
        requestOpts.ca = this._opts.sslCa
      }

      let protocol = this._opts.ssl ? https : http
      let req = protocol.request(requestOpts)

      req.on('error', (err) => {
        reject(new Error(
          `${requestErrorMsg}Request error: ${err.message}`))
      })

      req.on('response', (res) => {
        let data = ''

        res.on('data', (chunk) => { data += chunk })

        res.on('end', () => {
          if (res.statusCode === 401) {
            return reject(new Error(
              `${requestErrorMsg}Connection Rejected: 401 Unnauthorized`))
          }

          if (res.statusCode === 403) {
            return reject(new Error(
              `${requestErrorMsg}Connection Rejected: 403 Forbidden`))
          }

          try {
            let parsed = JSON.parse(data)
            if (parsed.error) {
              return reject(new Error(JSON.stringify(parsed.error)))
            }

            resolve(parsed)
          } catch (err) {
            reject(new Error(
              `${requestErrorMsg}Error Parsing JSON: ${err.message}`))
          }
        })
      })

      req.end(requestJSON)
    }), callback)
  }
}
