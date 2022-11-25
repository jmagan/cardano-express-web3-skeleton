const { validateResult } = require('../../../middleware/utils')
const { check } = require('express-validator')

/**
 * Validates change wallet request
 */
const validateChangeWallet = [
  check('email')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .isEmail()
    .withMessage('EMAIL_IS_NOT_VALID'),
  (req, res, next) => {
    validateResult(req, res, next)
  }
]

module.exports = { validateChangeWallet }
