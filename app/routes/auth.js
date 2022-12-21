const express = require('express')
const router = express.Router()
const trimRequest = require('trim-request')

const {
  register,
  verify,
  changeWallet,
  resetWallet,
  getRefreshToken,
  login,
  logout
} = require('../controllers/auth')

const {
  validateRegister,
  validateVerify,
  validateResetWallet,
  validateLogin,
  validateChangeWallet
} = require('../controllers/auth/validators')

/*
 * Auth routes
 */

/*
 * Register route
 */
router.post('/register', trimRequest.all, validateRegister, register)

/*
 * Verify route
 */
router.post('/verify', trimRequest.all, validateVerify, verify)

/*
 * Forgot password route
 */
router.post('/change', trimRequest.all, validateChangeWallet, changeWallet)

/*
 * Reset password route
 */
router.post('/reset', trimRequest.all, validateResetWallet, resetWallet)

/*
 * Get new refresh token
 */
router.get('/token', trimRequest.all, getRefreshToken)

/*
 * Login route
 */
router.post('/login', trimRequest.all, validateLogin, login)

/*
 *  Logout route
 */
router.get('/logout', trimRequest.all, logout)

module.exports = router
