const {
  createFakePrivateKey,
  createRewardAddress,
  createCOSESign1Signature,
  createCOSEKey
} = require('./test/helpers/auth')

const host = 'HOST'

/**
 *
 * @param {String} name
 * @param {String} email
 * @param {CSL.RewardAddress} address
 * @param {CSL.PrivateKey} privateKey
 * @returns
 */
const createRegisterUserSignature = (name, email, address, privateKey) => {
  const payload = {
    host,
    action: 'Sign up',
    name,
    email
  }

  return createCOSESign1Signature(payload, address, privateKey)
}

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

const fakePrivateKey = createFakePrivateKey(20)
const fakeStakeAddress = createRewardAddress(fakePrivateKey)
const name = 'My Name'
const email = 'my@email.com'
const coseKey = createCOSEKey(fakePrivateKey)
const coseSign1 = createRegisterUserSignature(
  name,
  email,
  fakeStakeAddress,
  fakePrivateKey
)

console.log(
  `Register data for address ${fakeStakeAddress.to_address().to_bech32()}`
)
console.log(`COSE signature for user ${email}:`)
console.log(`COSE Key CBOR: ${Buffer.from(coseKey.to_bytes()).toString('hex')}`)
console.log(
  `Full signature CBOR: ${Buffer.from(coseSign1.to_bytes()).toString('hex')}`
)

const adminPrivateKey = createFakePrivateKey(0)
const adminStakeAddress = createRewardAddress(adminPrivateKey)
const adminCoseKey = createCOSEKey(adminPrivateKey)
const adminLoginCoseSign1 = createLoginUserSignature(
  'admin@admin.com',
  adminStakeAddress,
  adminPrivateKey
)
const adminResetCoseSign1 = createCOSESign1Signature(
  { host, action: 'Reset' },
  adminStakeAddress,
  adminPrivateKey
)

console.log(
  `Register data for address ${adminStakeAddress.to_address().to_bech32()}`
)
console.log(`COSE signature to login as admin:`)
console.log(
  `COSE Key CBOR: ${Buffer.from(adminCoseKey.to_bytes()).toString('hex')}`
)
console.log(
  `Full signature CBOR: ${Buffer.from(adminLoginCoseSign1.to_bytes()).toString(
    'hex'
  )}`
)

console.log(`COSE signature for changing admin's wallet:`)
console.log(
  `Full signature CBOR: ${Buffer.from(adminResetCoseSign1.to_bytes()).toString(
    'hex'
  )}`
)

const fakePostUsetPrivateKey = createFakePrivateKey(13)
const fakePostAddress = createRewardAddress(fakePostUsetPrivateKey)

console.log(
  `Fake address for posting a new user ${fakePostAddress
    .to_address()
    .to_bech32()}`
)
