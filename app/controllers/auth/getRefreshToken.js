const {
  getUserIdFromToken,
  findUserById,
  generateAccessToken,
  setUserInfo
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
    const userInfo = await setUserInfo(user)
    const token = { accessToken: generateAccessToken(user), user: userInfo }
    res.status(200).json(token)
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { getRefreshToken }
