const { matchedData } = require('express-validator')
const {
  findUser,
  changeWalletResponse,
  saveChangeWallet
} = require('./helpers')
const { handleError } = require('../../middleware/utils')
const { sendChangeWalletEmailMessage } = require('../../middleware/emailer')

/**
 * Change waller function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const changeWallet = async (req, res) => {
  try {
    // Gets locale from header 'Accept-Language'
    const locale = req.getLocale()
    const data = matchedData(req)
    await findUser(data.email)
    const item = await saveChangeWallet(req)
    sendChangeWalletEmailMessage(locale, item)
    res.status(200).json(changeWalletResponse(item))
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { changeWallet }
