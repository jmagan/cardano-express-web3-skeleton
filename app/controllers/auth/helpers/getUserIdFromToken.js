const jwt = require('jsonwebtoken')
const { buildErrObject } = require('../../../middleware/utils')
const { decrypt } = require('../../../middleware/auth')

/**
 * Gets user id from token
 * @param {string} token - Encrypted and encoded token
 */
const getUserIdFromToken = (token = '') => {
  return new Promise((resolve, reject) => {
    // Decrypts, verifies and decode token
    jwt.verify(decrypt(token), process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          reject(buildErrObject(401, 'EXPIRED_TOKEN'))
        } else {
          reject(buildErrObject(409, 'BAD_TOKEN'))
        }
      }
      resolve(decoded.data._id)
    })
  })
}

module.exports = { getUserIdFromToken }
