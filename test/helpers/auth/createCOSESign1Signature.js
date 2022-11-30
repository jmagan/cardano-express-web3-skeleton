const MSG = require('@emurgo/cardano-message-signing-nodejs')

/**
 *
 * @param {Object} payload
 * @param {CSL.RewardAddress} address
 * @param {CSL.PrivateKey} privateKey
 * @returns
 */
const createCOSESign1Signature = (payload, address, privateKey) => {
  const protectedHeaders = MSG.HeaderMap.new()
  protectedHeaders.set_header(
    MSG.Label.new_text('address'),
    MSG.CBORValue.new_bytes(address.to_address().to_bytes())
  )
  const protectedHeadersSerialized =
    MSG.ProtectedHeaderMap.new(protectedHeaders)
  const headers = MSG.Headers.new(
    protectedHeadersSerialized,
    MSG.HeaderMap.new()
  )
  const builder = MSG.COSESign1Builder.new(
    headers,
    Buffer.from(JSON.stringify(payload)),
    false
  )
  const toSign = builder.make_data_to_sign().to_bytes()
  const signedSignature = privateKey.sign(toSign).to_bytes()

  return builder.build(signedSignature)
}

module.exports = { createCOSESign1Signature }
