const UserAccess = require('../../../models/userAccess')
const { setUserInfo } = require('./setUserInfo')
const { generateAccessToken } = require('./generateAccessToken.js')
const {
  getIP,
  getBrowserInfo,
  getCountry,
  buildErrObject
} = require('../../../middleware/utils')
const { generateRefreshToken } = require('./generateRefreshToken')

/**
 * Saves a new user access and then returns token
 * @param {Object} req - request object
 * @param {import('express').Response} res - response object
 * @param {Object} user - user object
 */
const saveUserAccessAndReturnToken = (req = {}, res = {}, user = {}) => {
  return new Promise((resolve, reject) => {
    const userAccess = new UserAccess({
      email: user.email,
      ip: getIP(req),
      browser: getBrowserInfo(req),
      country: getCountry(req)
    })
    userAccess.save(async (err) => {
      try {
        if (err) {
          return reject(buildErrObject(422, err.message))
        }
        const userInfo = await setUserInfo(user)

        res.cookie('jwt', generateRefreshToken(user._id), {
          httpOnly: true,
          sameSite: 'None',
          secure: process.env.NODE_ENV !== 'development',
          maxAge: 24 * 60 * 60 * 1000
        })
        // Returns data with access token
        resolve({
          accessToken: generateAccessToken(user._id),
          user: userInfo
        })
      } catch (error) {
        reject(error)
      }
    })
  })
}

module.exports = { saveUserAccessAndReturnToken }
