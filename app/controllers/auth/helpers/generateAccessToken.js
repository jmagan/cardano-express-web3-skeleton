const jwt = require('jsonwebtoken')
const { encrypt } = require('../../../middleware/auth')

/**
 * Generates a token
 * @param {Object} user - user object
 */
const generateAccessToken = (user = '') => {
  try {
    // Gets expiration time
    const expiration =
      Math.floor(Date.now() / 1000) +
      Number(process.env.JWT_ACCESS_TOKEN_EXPIRATION_IN_SECONDS)

    // returns signed and encrypted token
    return encrypt(
      jwt.sign(
        {
          data: {
            _id: user
          },
          exp: expiration
        },
        process.env.JWT_SECRET
      )
    )
  } catch (error) {
    throw error
  }
}

module.exports = { generateAccessToken }
