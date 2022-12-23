const { createCOSEKey } = require('./createCOSEKey')
const { createCOSESign1Signature } = require('./createCOSESign1Signature')
const { createFakePrivateKey } = require('./createFakePrivateKey')
const { createRewardAddress } = require('./createRewardAddress')

/**
 *
 * @param {String} host
 * @returns
 */
const getAdminLoginDetails = (host) => {
  /**
   *
   * @param {CSL.RewardAddress} address
   * @param {CSL.PrivateKey} PrivateKey
   * @returns
   */
  const createLoginUserSignature = (address, privateKey) => {
    const payload = {
      host,
      action: 'Login',
      timestamp: Date.now()
    }
    return createCOSESign1Signature(payload, address, privateKey)
  }

  const adminPrivateKey = createFakePrivateKey(0)
  const adminStakeAddress = createRewardAddress(adminPrivateKey)

  return {
    key: Buffer.from(createCOSEKey(adminPrivateKey).to_bytes()).toString('hex'),
    signature: Buffer.from(
      createLoginUserSignature(adminStakeAddress, adminPrivateKey).to_bytes()
    ).toString('hex')
  }
}

module.exports = { getAdminLoginDetails }
