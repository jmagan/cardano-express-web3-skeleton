const { createCOSEKey } = require('../../../test/helpers/auth/createCOSEKey.js')
const {
  createCOSESign1Signature
} = require('../../../test/helpers/auth/createCOSESign1Signature.js')
const {
  createFakePrivateKey
} = require('../../../test/helpers/auth/createFakePrivateKey.js')
const {
  createRewardAddress
} = require('../../../test/helpers/auth/createRewardAddress.js')
const { verifyCoseSign1Signature } = require('./verifyCoseSign1Signature.js')

const stakePrivateKey1 = createFakePrivateKey(11)

const stakeAddress1 = createRewardAddress(stakePrivateKey1)

const stakePrivateKey2 = createFakePrivateKey(12)

const stakeAddress2 = createRewardAddress(stakePrivateKey2)

describe('verifyCoseSign1Signature()', () => {
  it('Should verify a correct signature', async () => {
    const result = await verifyCoseSign1Signature(
      Buffer.from(createCOSEKey(stakePrivateKey1).to_bytes()).toString('hex'),
      Buffer.from(
        createCOSESign1Signature({}, stakeAddress1, stakePrivateKey1).to_bytes()
      ).toString('hex')
    )
    expect(result).toBe(true)
  })

  it('Should not verify a incorrect key', async () => {
    const result = await verifyCoseSign1Signature(
      Buffer.from(createCOSEKey(stakePrivateKey2).to_bytes()).toString('hex'),
      Buffer.from(
        createCOSESign1Signature({}, stakeAddress1, stakePrivateKey1).to_bytes()
      ).toString('hex')
    )
    expect(result).toBe(false)
  })

  it('Should not verify a incorrect tampered signature', async () => {
    const result = await verifyCoseSign1Signature(
      Buffer.from(createCOSEKey(stakePrivateKey1).to_bytes()).toString('hex'),
      Buffer.from(
        createCOSESign1Signature({}, stakeAddress2, stakePrivateKey2).to_bytes()
      ).toString('hex')
    )
    expect(result).toBe(false)
  })
})
