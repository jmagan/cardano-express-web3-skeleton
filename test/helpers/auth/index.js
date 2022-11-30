const { createFakePrivateKey } = require('./createFakePrivateKey.js')
const { createRewardAddress } = require('./createRewardAddress')
const { createCOSEKey } = require('./createCOSEKey.js')
const { createCOSESign1Signature } = require('./createCOSESign1Signature.js')
const { getAdminLoginDetails } = require('./getAdminLoginDetails.js')
const { getUserLoginDetails } = require('./getUserLoginDetails.js')

module.exports = {
  createFakePrivateKey,
  createRewardAddress,
  createCOSEKey,
  createCOSESign1Signature,
  getAdminLoginDetails,
  getUserLoginDetails
}
