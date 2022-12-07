const { validateResult } = require('../../../middleware/utils')
const { check } = require('express-validator')

/**
 * Validates register request
 */
/**
 * Validates login request
 */
const validateLogin = [
  check('key')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('signature')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  (req, res, next) => {
    validateResult(req, res, next)
  }
]

module.exports = { validateLogin }
