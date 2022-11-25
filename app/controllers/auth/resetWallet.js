const { matchedData } = require('express-validator')
const {
  findChangeWallet,
  findUserToResetWallet,
  updateWallet,
  markChangeWalletAsUsed
} = require('./helpers')
const { handleError } = require('../../middleware/utils')
const {
  verifyCoseSign1SignatureAndAddress
} = require('./helpers/verifyCoseSign1SignatureAndAddress')

/**
 * Reset password function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const resetWallet = async (req, res) => {
  try {
    const data = matchedData(req)
    const changeWallet = await findChangeWallet(data.id)
    const user = await findUserToResetWallet(changeWallet.email)

    await verifyCoseSign1SignatureAndAddress(
      data.key,
      data.signature,
      data.walletAddress
    )

    await updateWallet(data.walletAddress, user)
    const result = await markChangeWalletAsUsed(req, changeWallet)
    res.status(200).json(result)
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { resetWallet }
