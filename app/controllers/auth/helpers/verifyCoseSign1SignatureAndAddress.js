const { buildErrObject } = require('../../../middleware/utils')
const {
  verifyCoseSign1Signature,
  verifyCoseSign1Address
} = require('../../../services/crypto')

const verifyCoseSign1SignatureAndAddress = (key, signature, address) => {
  return new Promise((resolve, reject) => {
    try {
      const signatureChecked = verifyCoseSign1Signature(key, signature)
      const addressChecked = verifyCoseSign1Address(key, signature, address)

      if (!signatureChecked || !addressChecked) {
        reject(buildErrObject(422, 'INVALID_SIGNATURE'))
      }

      resolve(signatureChecked && addressChecked)
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      reject(buildErrObject(422, 'INVALID_SIGNATURE'))
    }
  })
}

module.exports = { verifyCoseSign1SignatureAndAddress }
