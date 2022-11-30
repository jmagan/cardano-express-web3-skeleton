const {
  verifyCoseSign1Address,
  verifyCoseSign1Signature
} = require('../../services/crypto')
const { buildErrObject } = require('../utils')

/**
 * Checks if signature matches
 * @param {string} key - public key
 * @param {string} signature - signature
 * @param {Object} user - user object
 * @returns {boolean}
 */
const checkSignature = (key, signature, user = {}) => {
  return new Promise((resolve, reject) => {
    try {
      const signatureCheched = verifyCoseSign1Signature(key, signature)
      const addressChecked = verifyCoseSign1Address(
        key,
        signature,
        user.walletAddress
      )
      resolve(signatureCheched && addressChecked)
    } catch (err) {
      reject(buildErrObject(422, err.message))
    }
  })
}

module.exports = { checkSignature }
