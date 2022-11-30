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
   * @param {String} name
   * @param {String} email
   * @param {CSL.RewardAddress} address
   * @param {CSL.PrivateKey} PrivateKey
   * @returns
   */
  const createLoginUserSignature = (email, address, privateKey) => {
    const payload = {
      host,
      action: 'Login',
      email
    }
    return createCOSESign1Signature(payload, address, privateKey)
  }

  const userPrivateKey = createFakePrivateKey(1)
  const userStakeAddress = createRewardAddress(userPrivateKey)

  return {
    email: 'user@user.com',
    key: Buffer.from(createCOSEKey(userPrivateKey).to_bytes()).toString('hex'),
    signature: Buffer.from(
      createLoginUserSignature(
        'user@user.com',
        userStakeAddress,
        userPrivateKey
      ).to_bytes()
    ).toString('hex')
  }
}

module.exports = { getUserLoginDetails }
