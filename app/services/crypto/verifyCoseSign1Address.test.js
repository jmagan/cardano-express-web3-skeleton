const { verifyCoseSign1Address } = require('./verifyCoseSign1Address.js')
const {
  createFakePrivateKey
} = require('../../../test/helpers/auth/createFakePrivateKey.js')
const {
  createRewardAddress
} = require('../../../test/helpers/auth/createRewardAddress.js')
const {
  createCOSESign1Signature
} = require('../../../test/helpers/auth/createCOSESign1Signature.js')
const { createCOSEKey } = require('../../../test/helpers/auth/createCOSEKey.js')

const stakePrivateKey1 = createFakePrivateKey(11)

const stakeAddress1 = createRewardAddress(stakePrivateKey1)

const stakePrivateKey2 = createFakePrivateKey(12)

const stakeAddress2 = createRewardAddress(stakePrivateKey2)

describe('verifyCoseSign1Address()', () => {
  it('Should verify a correct signature', async () => {
    const coseSign1 = createCOSESign1Signature(
      { host: 'host' },
      stakeAddress1,
      stakePrivateKey1
    )
    const coseKey = createCOSEKey(stakePrivateKey1)

    const result = await verifyCoseSign1Address(
      Buffer.from(coseKey.to_bytes()).toString('hex'),
      Buffer.from(coseSign1.to_bytes()).toString('hex'),
      stakeAddress1.to_address().to_bech32()
    )
    expect(result).toBe(true)
  })

  it('Should not verify a correct signature and incorrect address', async () => {
    const coseSign1 = createCOSESign1Signature(
      { host: 'host' },
      stakeAddress1,
      stakePrivateKey1
    )
    const coseKey = createCOSEKey(stakePrivateKey1)

    const result = await verifyCoseSign1Address(
      Buffer.from(coseKey.to_bytes()).toString('hex'),
      Buffer.from(coseSign1.to_bytes()).toString('hex'),
      stakeAddress2.to_address().to_bech32()
    )
    expect(result).toBe(false)
  })

  it('Should not verify a incorrect key', async () => {
    const coseSign1 = createCOSESign1Signature(
      { host: 'host' },
      stakeAddress1,
      stakePrivateKey1
    )
    const coseKey = createCOSEKey(stakePrivateKey2)

    const result = await verifyCoseSign1Address(
      Buffer.from(coseKey.to_bytes()).toString('hex'),
      Buffer.from(coseSign1.to_bytes()).toString('hex'),
      stakeAddress1.to_address().to_bech32()
    )
    expect(result).toBe(false)
  })

  it('Should not verify a incorrect tampered signature', async () => {
    const coseSign1 = createCOSESign1Signature(
      { host: 'host' },
      stakeAddress2,
      stakePrivateKey1
    )
    const coseKey = createCOSEKey(stakePrivateKey1)

    const result = await verifyCoseSign1Address(
      Buffer.from(coseKey.to_bytes()).toString('hex'),
      Buffer.from(coseSign1.to_bytes()).toString('hex'),
      stakeAddress1.to_address().to_bech32()
    )
    expect(result).toBe(false)
  })
})
