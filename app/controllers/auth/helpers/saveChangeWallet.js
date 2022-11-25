const uuid = require('uuid')
const ChangeWallet = require('../../../models/changeWallet')
const {
  getIP,
  getBrowserInfo,
  getCountry,
  buildErrObject
} = require('../../../middleware/utils')

/**
 * Creates a new password forgot
 * @param {Object} req - request object
 */
const saveChangeWallet = (req = {}) => {
  return new Promise((resolve, reject) => {
    const forgot = new ChangeWallet({
      email: req.body.email,
      verification: uuid.v4(),
      ipRequest: getIP(req),
      browserRequest: getBrowserInfo(req),
      countryRequest: getCountry(req)
    })
    forgot.save((err, item) => {
      if (err) {
        return reject(buildErrObject(422, err.message))
      }
      resolve(item)
    })
  })
}

module.exports = { saveChangeWallet }
