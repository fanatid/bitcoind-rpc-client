# bitcoind-rpc-client

[![NPM Package](https://img.shields.io/npm/v/bitcoind-rpc-client.svg?style=flat-square)](https://www.npmjs.org/package/bitcoind-rpc-client)
[![build status](https://img.shields.io/travis/fanatid/bitcoind-rpc-client.svg?branch=master&style=flat-square)](http://travis-ci.org/fanatid/bitcoind-rpc-client)
[![Coverage Status](https://img.shields.io/coveralls/fanatid/bitcoind-rpc-client.svg?style=flat-square)](https://coveralls.io/r/fanatid/bitcoind-rpc-client)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/feross/standard)
[![Dependency status](https://img.shields.io/david/fanatid/bitcoind-rpc-client.svg?style=flat-square)](https://david-dm.org/fanatid/bitcoind-rpc-client#info=dependencies)

Bitcoind RPC client with blackjack and hookers.

Current rpc client support promises and callbacks.

## Installation

```bash
npm install bitcoind-rpc-client
```

## Commands

You can find list of all available commands in [source code](blob/master/src/methods.js).

## Examples

### Create client

```js
var client = new RpcClient({
  host: '127.0.0.1',
  port: 18332
});
client.set('user', 'bitcoinrpc')
```

### getnewaddress with callback

```js
client.getNewAddress(function (err, result) {
  console.log(err, result) // null, {result: {...}, error: null}
})
```

### getnewaddress with promise

```js
client.getNewAddress().then(function (result) {
  console.log(result) // {result: {...}, error: null}
})
```

### alias of getnewaddress with promise

```js
client.getnewaddress().then(function (result) {
  console.log(result) // {result: {...}, error: null}
})
```

### getnewaddress using `cmd`

```js
client.cmd('getnewaddress').then(function (result) {
  console.log(result) // {result: {...}, error: null}
})
```

### batch (array form)

```js
client.batch([
  {method: 'getnewaddress', params: ['myaccount']},
  {method: 'getnewaddress', params: ['myaccount']}
])
.then(function (result) {
  console.log(result) // [{result: {...}, error: null}, {result: {...}, error: null}]
})
```

### batch (chained form)

```js
client.batch()
  .getInfo()
  .clear()
  .getNewAddress('myaccount')
  .getNewAddress('secondaccount')
  .call()
  .then(function (result) {
    console.log(result) // [{result: {...}, error: null}, {result: {...}, error: null}]
  })
```

## License

This software is licensed under the MIT License.
