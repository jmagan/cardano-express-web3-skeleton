const { matchedData } = require('express-validator')

const { registerUser, setUserInfo, returnRegisterToken } = require('./helpers')

const { handleError, buildErrObject } = require('../../middleware/utils')
const { walletAddressExists } = require('../../services/users')
const {
  emailExists,
  sendRegistrationEmailMessage
} = require('../../middleware/emailer')
/**
 * Register function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const register = async (req, res) => {
  try {
    // Gets locale from header 'Accept-Language'
    const locale = req.getLocale()
    const payload = req.authInfo
    req = matchedData(req)
    const doesEmailOrWalletAddressExists =
      (await emailExists(req.email)) ||
      (await walletAddressExists(req.walletAddress))

    if (payload.email !== req.email || payload.name !== req.name) {
      throw buildErrObject(422, 'INVALID_PAYLOAD')
    }

    if (!doesEmailOrWalletAddressExists) {
      const item = await registerUser(req)
      const userInfo = await setUserInfo(item)
      const response = await returnRegisterToken(item, userInfo)
      sendRegistrationEmailMessage(locale, item)
      res.status(201).json(response)
    }
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { register }
