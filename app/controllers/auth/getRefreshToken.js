const {
  getUserIdFromToken,
  findUserById,
  generateAccessToken
} = require('./helpers')
const { isIDGood, handleError } = require('../../middleware/utils')

/**
 * Refresh token function called by route
 * @param {import('express').Request} req - request object
 * @param {import('express').Response} res - response object
 */
const getRefreshToken = async (req, res) => {
  try {
    const tokenEncrypted = req.cookies['jwt']
    let userId = await getUserIdFromToken(tokenEncrypted)
    userId = await isIDGood(userId)
    const user = await findUserById(userId)
    const token = { accessToken: generateAccessToken(user) }
    res.status(200).json(token)
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { getRefreshToken }
