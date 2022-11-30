const CSL = require('@emurgo/cardano-serialization-lib-nodejs')

/**
 *
 * @param {number} accountNumber - Number between 0 and 255 for mocking private key
 * @returns
 */
const createFakePrivateKey = (accountNumber) => {
  return CSL.PrivateKey.from_normal_bytes(new Array(32).fill(accountNumber))
}

module.exports = { createFakePrivateKey }
