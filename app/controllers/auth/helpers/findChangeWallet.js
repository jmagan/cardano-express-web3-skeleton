const ChangeWallet = require('../../../models/changeWallet')
const { itemNotFound } = require('../../../middleware/utils')

/**
 * Checks if a forgot password verification exists
 * @param {string} id - verification id
 */
const findChangeWallet = (id = '') => {
  return new Promise((resolve, reject) => {
    ChangeWallet.findOne(
      {
        verification: id,
        used: false
      },
      async (err, item) => {
        try {
          await itemNotFound(err, item, 'NOT_FOUND_OR_ALREADY_USED')
          resolve(item)
        } catch (error) {
          reject(error)
        }
      }
    )
  })
}

module.exports = { findChangeWallet }
