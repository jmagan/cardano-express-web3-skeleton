const MSG = require('@emurgo/cardano-message-signing-nodejs')
const { buildErrObject } = require('../../../middleware/utils')

/**
 *
 * @param {MSG.COSESign1} signature
 * @param {String} action
 */
const verifyPayload = (signature, action) => {
  try {
    const coseSign1 = MSG.COSESign1.from_bytes(Buffer.from(signature, 'hex'))
    const payload = JSON.parse(Buffer.from(coseSign1.payload()).toString())

    if (payload.host !== process.env.HOST || payload.action !== action) {
      throw buildErrObject(422, 'INVALID_PAYLOAD')
    }

    if (process.env.NODE_ENV !== 'development') {
      if (!Number.isInteger(payload.timestamp)) {
        throw buildErrObject(422, 'INVALID_PAYLOAD')
      }

      if (
        payload.timestamp > Date.now() ||
        payload.timestamp <
          Date.now() - process.env.PAYLOAD_VALIDITY_IN_SECONDS * 1000
      ) {
        throw buildErrObject(422, 'EXPIRED_PAYLOAD')
      }
    }

    return payload
  } catch (err) {
    throw buildErrObject(422, err.message)
  }
}

module.exports = verifyPayload
