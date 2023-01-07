const { saveUserAccessAndReturnToken } = require('./helpers')

const { handleError } = require('../../middleware/utils')
const { findUserByWalleAddress } = require('./helpers/findUserByWalletAddress')

/**
 * Login function called by route
 * @param {import('express').Request} req - request object
 * @param {import('express').Response} res - response object
 */
const login = async (req, res) => {
  try {
    const walletAddress = req.user.id
    const user = await findUserByWalleAddress(walletAddress)
    res.status(200).json(await saveUserAccessAndReturnToken(req, res, user))
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { login }
