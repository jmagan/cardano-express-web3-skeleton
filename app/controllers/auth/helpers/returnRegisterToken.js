const { generateAccessToken } = require('./generateAccessToken')

/**
 * Builds the registration token
 * @param {Object} item - user object that contains created id
 * @param {Object} userInfo - user object
 */
const returnRegisterToken = (
  { _id = '', verification = '' },
  userInfo = {}
) => {
  return new Promise((resolve) => {
    if (process.env.NODE_ENV !== 'production') {
      userInfo.verification = verification
    }
    const data = {
      accessToken: generateAccessToken(_id),
      user: userInfo
    }
    resolve(data)
  })
}

module.exports = { returnRegisterToken }
