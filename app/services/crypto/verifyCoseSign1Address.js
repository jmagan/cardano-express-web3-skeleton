const CSL = require('@emurgo/cardano-serialization-lib-nodejs')
const MSG = require('@emurgo/cardano-message-signing-nodejs')
const { buildErrObject } = require('../../middleware/utils')

const verifyCoseSign1Address = (key, signature) => {
  return new Promise((resolve, reject) => {
    try {
      const coseSignature = MSG.COSESign1.from_bytes(
        Buffer.from(signature, 'hex')
      )

      const coseKey = MSG.COSEKey.from_bytes(Buffer.from(key, 'hex'))

      const bKey = coseKey
        .header(
          MSG.Label.new_int(MSG.Int.new_negative(MSG.BigNum.from_str('2')))
        )
        .as_bytes()

      const publicKey = CSL.PublicKey.from_bytes(bKey)

      const bAddress = coseSignature
        .headers()
        .protected()
        .deserialized_headers()
        .header(MSG.Label.new_text('address'))
        .as_bytes()

      const address = CSL.RewardAddress.from_address(
        CSL.Address.from_bytes(bAddress)
      )

      const signatureKeyHash = address.payment_cred().to_keyhash().to_hex()
      const publicKeyHash = publicKey.hash().to_hex()

      resolve(signatureKeyHash === publicKeyHash)
    } catch (err) {
      return reject(buildErrObject(422, err.message))
    }
  })
}

module.exports = { verifyCoseSign1Address }
