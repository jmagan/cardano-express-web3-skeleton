const User = require('../../models/user')
const { buildErrObject } = require('../../middleware/utils')

/**
 * Checks User model if user with an specific wallet address exists
 * @param {string} walletAddress - user wallet address
 */
const walletAddressExists = (walletAddress = '') => {
  return new Promise((resolve, reject) => {
    User.findOne(
      {
        walletAddress
      },
      (err, item) => {
        if (err) {
          return reject(buildErrObject(422, err.message))
        }

        if (item) {
          return reject(buildErrObject(422, 'WALLET_ADDRESS_ALREADY_EXISTS'))
        }
        resolve(false)
      }
    )
  })
}

module.exports = { walletAddressExists }
