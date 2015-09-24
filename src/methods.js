let methods = [
  // == Blockchain ==
  'getBestBlockHash',
  'getBlock',
  'getBlockchainInfo',
  'getBlockCount',
  'getBlockHash',
  'getBlockHeader',
  'getChainTips',
  'getDifficulty',
  'getMemPoolInfo',
  'getRawMemPool',
  'getTxOut',
  'getTxOutProof',
  'getTxOutSetInfo',
  'verifyChain',
  'verifyTxOutProof',

  // == Control ==
  'getInfo',
  'help',
  'stop',

  // == Generating ==
  'generate',
  'getGenerate',
  'setGenerate',

  // == Mining ==
  'getBlockTemplate',
  'getMiningInfo',
  'getNetworkHashPs',
  'prioritiseTransaction',
  'submitBlock',

  // == Network ==
  'addNode',
  'clearBanned',
  'disconnectNode',
  'getAddedNodeInfo',
  'getConnectionCount',
  'getNetTotals',
  'getNetworkInfo',
  'getPeerInfo',
  'listBanned',
  'ping',
  'setban',

  // == Raw Transactions ==
  'createRawTransaction',
  'decodeRawTransaction',
  'decodeScript',
  'fundRawTransaction',
  'getRawTransaction',
  'sendRawTransaction',
  'signRawTransaction',

  // == Util ==
  'createMultisig',
  'estimateFee',
  'estimatePriority',
  'validateAddress',
  'verifyMessage',

  // == Wallet ==
  'addMultisigAddress',
  'backupWallet',
  'dumpPrivKey',
  'dumpWallet',
  'encryptWallet',
  'getAccount',
  'getAccountAddress',
  'getAddressesByAccount',
  'getBalance',
  'getNewAddress',
  'getRawChangeAddress',
  'getReceivedByAccount',
  'getReceivedByAddress',
  'getTransaction',
  'getUnconfirmedBalance',
  'getWalletInfo',
  'importAddress',
  'importPrivKey',
  'importPubKey',
  'importWallet',
  'keyPoolRefill',
  'listAccounts',
  'listAddressGroupings',
  'listLockUnspent',
  'listReceivedByAccount',
  'listReceivedByAddress',
  'listSinceBlock',
  'listTransactions',
  'listUnspent',
  'lockUnspent',
  'move',
  'sendFrom',
  'sendMany',
  'sendToAddress',
  'setAccount',
  'setTxFee',
  'signMessage'
]

export default class Methods {}

for (let method of methods) {
  let methodName = method.toLowerCase()

  Methods.prototype[method] = function (...params) {
    return this.cmd(methodName, ...params)
  }

  Methods.prototype[methodName] = Methods.prototype[method]
}
