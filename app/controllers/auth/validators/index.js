const { validateChangeWallet } = require('./validateChangeWallet')
const { validateLogin } = require('./validateLogin')
const { validateRegister } = require('./validateRegister')
const { validateResetWallet } = require('./validateResetWallet')
const { validateVerify } = require('./validateVerify')

module.exports = {
  validateChangeWallet,
  validateLogin,
  validateRegister,
  validateResetWallet,
  validateVerify
}
