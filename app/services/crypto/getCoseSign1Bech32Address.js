const CSL = require('@emurgo/cardano-serialization-lib-nodejs')
const MSG = require('@emurgo/cardano-message-signing-nodejs')
const { buildErrObject } = require('../../middleware/utils')

/**
 * Get the bech32 address from a COSE_Sign1 signature
 * @param {String} signature - Hex string represeantation of a COSE_Sign1 signature
 */
const getCoseSign1Bech32Address = (signature) => {
  return new Promise((resolve, reject) => {
    try {
      const coseSignature = MSG.COSESign1.from_bytes(
        Buffer.from(signature, 'hex')
      )

      const bAddress = coseSignature
        .headers()
        .protected()
        .deserialized_headers()
        .header(MSG.Label.new_text('address'))
        .as_bytes()

      const address = CSL.Address.from_bytes(bAddress)

      resolve(address.to_bech32())
    } catch (err) {
      return reject(buildErrObject(422, err.message))
    }
  })
}

module.exports = { getCoseSign1Bech32Address }
