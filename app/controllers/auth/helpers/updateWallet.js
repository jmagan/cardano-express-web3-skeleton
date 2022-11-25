const { itemNotFound } = require('../../../middleware/utils')

/**
 * Updates a user wallet address in database
 * @param {string} walletAddress - new wallet address
 * @param {Object} user - user object
 */
const updateWallet = (walletAddress = '', user = {}) => {
  return new Promise((resolve, reject) => {
    user.walletAddress = walletAddress
    user.save(async (err, item) => {
      try {
        await itemNotFound(err, item, 'NOT_FOUND')
        resolve(item)
      } catch (error) {
        reject(error)
      }
    })
  })
}

module.exports = { updateWallet }
