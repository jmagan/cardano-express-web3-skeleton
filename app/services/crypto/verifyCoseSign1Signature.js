const CSL = require('@emurgo/cardano-serialization-lib-nodejs')
const MSG = require('@emurgo/cardano-message-signing-nodejs')
const { buildErrObject } = require('../../middleware/utils')

const verifyCoseSign1Signature = (key, signature) => {
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

      const signedPayload = coseSignature.signed_data().to_bytes()

      const ed25519Signature = CSL.Ed25519Signature.from_bytes(
        coseSignature.signature()
      )

      resolve(publicKey.verify(signedPayload, ed25519Signature))
    } catch (err) {
      return reject(buildErrObject(422, err.message))
    }
  })
}

module.exports = { verifyCoseSign1Signature }
