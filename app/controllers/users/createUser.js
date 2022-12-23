const { matchedData } = require('express-validator')
const { handleError } = require('../../middleware/utils')
const {
  emailExists,
  sendRegistrationEmailMessage
} = require('../../middleware/emailer')
const { createItemInDb } = require('./helpers')
const { walletAddressExists } = require('../../services/users')

/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const createUser = async (req, res) => {
  try {
    // Gets locale from header 'Accept-Language'
    const locale = req.getLocale()
    req = matchedData(req)
    const doesEmailOrWalletAddressExists =
      (await emailExists(req.email)) ||
      (await walletAddressExists(req.walletAddress))
    if (!doesEmailOrWalletAddressExists) {
      const item = await createItemInDb(req)
      sendRegistrationEmailMessage(locale, item)
      res.status(201).json(item)
    }
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { createUser }
