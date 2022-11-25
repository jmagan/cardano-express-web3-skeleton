const i18n = require('i18n')
const { prepareToSendEmail } = require('./prepareToSendEmail')

/**
 * Sends reset password email
 * @param {string} locale - locale
 * @param {Object} user - user object
 */
const sendChangeWalletEmailMessage = (locale = '', user = {}) => {
  i18n.setLocale(locale)
  const subject = i18n.__('changeWallet.SUBJECT')
  const htmlMessage = i18n.__(
    'changeWallet.MESSAGE',
    user.email,
    process.env.FRONTEND_URL,
    user.verification
  )
  prepareToSendEmail(user, subject, htmlMessage)
}

module.exports = { sendChangeWalletEmailMessage }
