const { matchedData } = require('express-validator')

const { registerUser, setUserInfo, returnRegisterToken } = require('./helpers')

const { handleError, buildErrObject } = require('../../middleware/utils')
const {
  emailExists,
  sendRegistrationEmailMessage
} = require('../../middleware/emailer')
const {
  verifyCoseSign1SignatureAndAddress
} = require('./helpers/verifyCoseSign1SignatureAndAddress')
const verifyPayload = require('./helpers/verifyPayload')

/**
 * Register function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const register = async (req, res) => {
  try {
    // Gets locale from header 'Accept-Language'
    const locale = req.getLocale()
    req = matchedData(req)
    const doesEmailExists = await emailExists(req.email)
    await verifyCoseSign1SignatureAndAddress(
      req.key,
      req.signature,
      req.walletAddress
    )

    const payload = await verifyPayload(req.signature, 'Sign up')

    if (payload.email !== req.email || payload.name !== req.name) {
      throw buildErrObject(422, 'INVALID_PAYLOAD')
    }

    if (!doesEmailExists) {
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
