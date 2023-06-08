const { createCOSEKey } = require('./createCOSEKey')
const { createCOSESign1Signature } = require('./createCOSESign1Signature')
const { createFakePrivateKey } = require('./createFakePrivateKey')
const { createRewardAddress } = require('./createRewardAddress')

/**
 *
 * @param {String} host
 * @returns
 */
const getUserLoginDetails = (host) => {
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
      uri: host + '/login',
      timestamp: Date.now()
    }
    return createCOSESign1Signature(payload, address, privateKey)
  }

  const userPrivateKey = createFakePrivateKey(1)
  const userStakeAddress = createRewardAddress(userPrivateKey)

  return {
    key: Buffer.from(createCOSEKey(userPrivateKey).to_bytes()).toString('hex'),
    signature: Buffer.from(
      createLoginUserSignature(userStakeAddress, userPrivateKey).to_bytes()
    ).toString('hex')
  }
}

module.exports = { getUserLoginDetails }
