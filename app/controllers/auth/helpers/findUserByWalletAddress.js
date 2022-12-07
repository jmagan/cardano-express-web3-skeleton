const User = require('../../../models/user')
const { itemNotFound } = require('../../../middleware/utils')

/**
 * Finds user by ID
 * @param {string} id - user´s id
 */
const findUserByWalleAddress = (walletAddress = '') => {
  return new Promise((resolve, reject) => {
    User.findOne(
      {
        walletAddress
      },
      'loginAttempts blockExpires name email role verified verification walletAddress',
      async (err, item) => {
        try {
          await itemNotFound(err, item, 'USER_DOES_NOT_EXIST')
          resolve(item)
        } catch (error) {
          reject(error)
        }
      }
    )
  })
}

module.exports = { findUserByWalleAddress }
