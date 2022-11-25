const faker = require('faker')
const ObjectID = require('mongodb').ObjectID
const CSL = require('@emurgo/cardano-serialization-lib-nodejs')

const adminPrivateKey = CSL.PrivateKey.from_normal_bytes(new Array(32).fill(0))
const adminWalletAddress = CSL.RewardAddress.new(
  CSL.NetworkId.mainnet().kind(),
  CSL.StakeCredential.from_keyhash(adminPrivateKey.to_public().hash())
)
  .to_address()
  .to_bech32()

const simpleUserPrivateKey = CSL.PrivateKey.from_normal_bytes(
  new Array(32).fill(1)
)
const simpleUserWalletAddress = CSL.RewardAddress.new(
  CSL.NetworkId.mainnet().kind(),
  CSL.StakeCredential.from_keyhash(simpleUserPrivateKey.to_public().hash())
)
  .to_address()
  .to_bech32()

module.exports = [
  {
    _id: new ObjectID('5aa1c2c35ef7a4e97b5e995a'),
    name: 'Super Administrator',
    email: 'admin@admin.com',
    role: 'admin',
    walletAddress: adminWalletAddress,
    verified: true,
    verification: '3d6e072c-0eaf-4239-bb5e-495e6486148f',
    city: 'Bucaramanga',
    country: 'Colombia',
    phone: '123123',
    urlTwitter: faker.internet.url(),
    urlGitHub: faker.internet.url(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  },
  {
    _id: new ObjectID('5aa1c2c35ef7a4e97b5e995b'),
    name: 'Simple user',
    email: 'user@user.com',
    walletAddress: simpleUserWalletAddress,
    role: 'user',
    verified: true,
    verification: '3d6e072c-0eaf-4239-bb5e-495e6486148d',
    city: 'Bucaramanga',
    country: 'Colombia',
    phone: '123123',
    urlTwitter: faker.internet.url(),
    urlGitHub: faker.internet.url(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  }
]
