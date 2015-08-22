/**
 * @param {Promise} promise
 * @param {function} [callback]
 * @return {Promise}
 */
export function asNodeCallaback (promise, callback) {
  if (typeof callback === 'function') {
    let errorAdapter = (err) => { callback(err) }
    let successAdapter = (value) => { callback(null, value) }

    promise.then(successAdapter, errorAdapter)
  }

  return promise
}
