const { matchedData } = require('express-validator')

const {
  userIsBlocked,
  checkLoginAttemptsAndBlockExpires,
  signatureIsInvalid,
  saveLoginAttemptsToDB,
  saveUserAccessAndReturnToken
} = require('./helpers')

const { handleError } = require('../../middleware/utils')
const { checkSignature } = require('../../middleware/auth')
const verifyPayload = require('./helpers/verifyPayload')
const { getCoseSign1Bech32Address } = require('../../services/crypto')
const { findUserByWalleAddress } = require('./helpers/findUserByWalletAddress')

/**
 * Login function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const login = async (req, res) => {
  try {
    const data = matchedData(req)
    const walletAddress = await getCoseSign1Bech32Address(data.signature)
    const user = await findUserByWalleAddress(walletAddress)
    await userIsBlocked(user)
    await checkLoginAttemptsAndBlockExpires(user)
    const isSignatureChecked = await checkSignature(
      data.key,
      data.signature,
      user
    )
    await verifyPayload(data.signature, 'Login')
    if (!isSignatureChecked) {
      handleError(res, await signatureIsInvalid(user))
    } else {
      // all ok, register access and return token
      user.loginAttempts = 0
      await saveLoginAttemptsToDB(user)
      res.status(200).json(await saveUserAccessAndReturnToken(req, user))
    }
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { login }
