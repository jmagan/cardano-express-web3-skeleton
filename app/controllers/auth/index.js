const { changeWallet } = require('./changeWallet')
const { getRefreshToken } = require('./getRefreshToken')
const { login } = require('./login')
const { register } = require('./register')
const { resetWallet } = require('./resetWallet')
const { roleAuthorization } = require('./roleAuthorization')
const { verify } = require('./verify')

module.exports = {
  changeWallet,
  getRefreshToken,
  login,
  register,
  resetWallet,
  roleAuthorization,
  verify
}
