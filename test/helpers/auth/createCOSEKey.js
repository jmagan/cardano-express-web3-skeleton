const MSG = require('@emurgo/cardano-message-signing-nodejs')

/**
 * Create a COSE Key structure from a private key
 *
 * @param {CSL.PrivateKey} privateKey - private key to extract the public key
 * @returns
 */
const createCOSEKey = (privateKey) => {
  const coseKey = MSG.COSEKey.new(MSG.Label.new_int(MSG.Int.new_i32(1)))
  coseKey.set_header(
    MSG.Label.new_int(MSG.Int.new_negative(MSG.BigNum.from_str('2'))),
    MSG.CBORValue.new_bytes(privateKey.to_public().as_bytes())
  )
  return coseKey
}

module.exports = { createCOSEKey }
