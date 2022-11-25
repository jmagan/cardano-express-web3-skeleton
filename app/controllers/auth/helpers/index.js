const { blockIsExpired } = require('./blockIsExpired')
const { blockUser } = require('./blockUser')
const {
  checkLoginAttemptsAndBlockExpires
} = require('./checkLoginAttemptsAndBlockExpires')
const { checkPermissions } = require('./checkPermissions')
const { findChangeWallet } = require('./findChangeWallet')
const { findUser } = require('./findUser')
const { findUserById } = require('./findUserById')
const { findUserToResetWallet } = require('./findUserToResetWallet')
const { changeWalletResponse } = require('./changeWalletResponse')
const { generateToken } = require('./generateToken')
const { getUserIdFromToken } = require('./getUserIdFromToken')
const { markChangeWalletAsUsed } = require('./markChangeWalletAsUsed')
const { signatureIsInvalid } = require('./signatureIsInvalid')
const { registerUser } = require('./registerUser')
const { returnRegisterToken } = require('./returnRegisterToken')
const { saveChangeWallet } = require('./saveChangeWallet')
const { saveLoginAttemptsToDB } = require('./saveLoginAttemptsToDB')
const {
  saveUserAccessAndReturnToken
} = require('./saveUserAccessAndReturnToken')
const { setUserInfo } = require('./setUserInfo')
const { updateWallet } = require('./updateWallet')
const { userIsBlocked } = require('./userIsBlocked')
const { verificationExists } = require('./verificationExists')
const { verifyUser } = require('./verifyUser')

module.exports = {
  blockIsExpired,
  blockUser,
  checkLoginAttemptsAndBlockExpires,
  checkPermissions,
  findChangeWallet,
  findUser,
  findUserById,
  findUserToResetWallet,
  changeWalletResponse,
  generateToken,
  getUserIdFromToken,
  markChangeWalletAsUsed,
  signatureIsInvalid,
  registerUser,
  returnRegisterToken,
  saveChangeWallet,
  saveLoginAttemptsToDB,
  saveUserAccessAndReturnToken,
  setUserInfo,
  updateWallet,
  userIsBlocked,
  verificationExists,
  verifyUser
}
