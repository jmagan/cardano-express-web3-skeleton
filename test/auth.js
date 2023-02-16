/* eslint handle-callback-err: "off"*/

process.env.NODE_ENV = 'test'

const User = require('../app/models/user')
const faker = require('faker')
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')
const {
  createFakePrivateKey,
  createRewardAddress,
  createCOSEKey,
  createCOSESign1Signature,
  getAdminLoginDetails
} = require('./helpers/auth')
// eslint-disable-next-line no-unused-vars
const should = chai.should()

const host = process.env.HOST

const adminPrivateKey = createFakePrivateKey(0)
const adminStakeAddress = createRewardAddress(adminPrivateKey)

const stakePrivateKey1 = createFakePrivateKey(10)
const stakeAddress1 = createRewardAddress(stakePrivateKey1)

const stakePrivateKey2 = createFakePrivateKey(11)
const stakeAddress2 = createRewardAddress(stakePrivateKey2)

const stakePrivateKey3 = createFakePrivateKey(12)
const stakeAddress3 = createRewardAddress(stakePrivateKey3)

const testName = `${faker.name.firstName()} ${faker.name.lastName()}`
const testEmail = faker.internet.email()

const testEmail2 = faker.internet.email()

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
    email,
    timestamp: Date.now(),
    url: host + '/register'
  }

  return createCOSESign1Signature(payload, address, privateKey)
}

const loginDetails = getAdminLoginDetails(host)
let accessToken = ''
let refreshTokenCookie = ''
const createdID = []
let verification = ''
let verificationChange = ''
const anotherUser = {
  name: 'Another user',
  email: 'another@user.com'
}

chai.use(chaiHttp)

describe('*********** AUTH ***********', () => {
  describe('/GET /', () => {
    it('it should GET home API url', (done) => {
      chai
        .request(server)
        .get('/')
        .end((err, res) => {
          res.should.have.status(200)
          done()
        })
    })
  })

  describe('/GET /404url', () => {
    it('it should GET 404 url', (done) => {
      chai
        .request(server)
        .get('/404url')
        .end((err, res) => {
          res.should.have.status(404)
          res.body.should.be.an('object')
          done()
        })
    })
  })

  describe('/POST login', () => {
    it('it should GET token', (done) => {
      chai
        .request(server)
        .post('/login')
        .send(loginDetails)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.an('object')
          res.body.should.have.property('accessToken')
          res.should.has.cookie('jwt')
          accessToken = res.body.accessToken
          refreshTokenCookie = res.get('Set-Cookie')[0]
          done()
        })
    })
    it('it should NOT verify the payload if it is expired', (done) => {
      const payload = {
        host: process.env.HOST,
        action: 'Login',
        url: '/login',
        timestamp:
          Date.now() - process.env.PAYLOAD_VALIDITY_IN_SECONDS * 1000 - 1
      }

      const coseSign1Signature = createCOSESign1Signature(
        payload,
        adminStakeAddress,
        adminPrivateKey
      )
      const coseKey = createCOSEKey(adminPrivateKey)
      const loginDetailsExpiredPayload = {
        key: Buffer.from(coseKey.to_bytes()).toString('hex'),
        signature: Buffer.from(coseSign1Signature.to_bytes()).toString('hex')
      }

      chai
        .request(server)
        .post('/login')
        .send(loginDetailsExpiredPayload)
        .end((err, res) => {
          res.should.have.status(401)
          done()
        })
    })

    it('it should NOT verify the payload if timestamp is missing', (done) => {
      const payload = {
        host: process.env.HOST,
        action: 'Login'
      }

      const coseSign1Signature = createCOSESign1Signature(
        payload,
        adminStakeAddress,
        adminPrivateKey
      )
      const coseKey = createCOSEKey(adminPrivateKey)
      const loginDetailsExpiredPayload = {
        key: Buffer.from(coseKey.to_bytes()).toString('hex'),
        signature: Buffer.from(coseSign1Signature.to_bytes()).toString('hex')
      }

      chai
        .request(server)
        .post('/login')
        .send(loginDetailsExpiredPayload)
        .end((err, res) => {
          res.should.have.status(500)
          done()
        })
    })
  })

  describe('/POST register', () => {
    it('it should POST register user 1', (done) => {
      const user = {
        name: testName,
        email: testEmail,
        walletAddress: stakeAddress1.to_address().to_bech32(),
        key: Buffer.from(createCOSEKey(stakePrivateKey1).to_bytes()).toString(
          'hex'
        ),
        signature: Buffer.from(
          createRegisterUserSignature(
            testName,
            testEmail,
            stakeAddress1,
            stakePrivateKey1
          ).to_bytes()
        ).toString('hex')
      }
      chai
        .request(server)
        .post('/register')
        .send(user)
        .end((err, res) => {
          res.should.have.status(201)
          res.body.should.be.an('object')
          res.body.should.include.keys('accessToken', 'user')
          createdID.push(res.body.user._id)
          verification = res.body.user.verification
          done()
        })
    })
    it('it should NOT POST a register if payload data mismatch request data', (done) => {
      const user = {
        name: faker.name.firstName(),
        email: faker.internet.email(),
        walletAddress: stakeAddress3.to_address().to_bech32(),
        key: Buffer.from(createCOSEKey(stakePrivateKey3).to_bytes()).toString(
          'hex'
        ),
        signature: Buffer.from(
          createRegisterUserSignature(
            faker.name.firstName(),
            faker.internet.email(),
            stakeAddress3,
            stakePrivateKey3
          ).to_bytes()
        ).toString('hex')
      }
      chai
        .request(server)
        .post('/register')
        .send(user)
        .end((err, res) => {
          res.should.have.status(422)
          res.body.should.be.a('object')
          res.body.should.have.property('errors').that.has.property('msg')
          res.body.errors.should.have.property('msg').eql('INVALID_PAYLOAD')
          done()
        })
    })
    it('it should NOT POST a register if wallet address already exists', (done) => {
      const user = {
        name: testName,
        email: testEmail2,
        walletAddress: stakeAddress1.to_address().to_bech32(),
        key: Buffer.from(createCOSEKey(stakePrivateKey1).to_bytes()).toString(
          'hex'
        ),
        signature: Buffer.from(
          createRegisterUserSignature(
            testName,
            testEmail2,
            stakeAddress1,
            stakePrivateKey1
          ).to_bytes()
        ).toString('hex')
      }
      chai
        .request(server)
        .post('/register')
        .send(user)
        .end((err, res) => {
          res.should.have.status(422)
          res.body.should.be.a('object')
          res.body.should.have.property('errors').that.has.property('msg')
          res.body.errors.should.have
            .property('msg')
            .eql('WALLET_ADDRESS_ALREADY_EXISTS')
          done()
        })
    })
    it('it should NOT POST a register if email already exists', (done) => {
      const user = {
        name: testName,
        email: testEmail,
        walletAddress: stakeAddress1.to_address().to_bech32(),
        key: Buffer.from(createCOSEKey(stakePrivateKey1).to_bytes()).toString(
          'hex'
        ),
        signature: Buffer.from(
          createRegisterUserSignature(
            testName,
            testEmail,
            stakeAddress1,
            stakePrivateKey1
          ).to_bytes()
        ).toString('hex')
      }
      chai
        .request(server)
        .post('/register')
        .send(user)
        .end((err, res) => {
          res.should.have.status(422)
          res.body.should.be.a('object')
          res.body.should.have.property('errors').that.has.property('msg')
          res.body.errors.should.have
            .property('msg')
            .eql('EMAIL_ALREADY_EXISTS')
          done()
        })
    })
  })

  describe('/POST verify', () => {
    it('it should POST verify', (done) => {
      chai
        .request(server)
        .post('/verify')
        .send({
          id: verification
        })
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.an('object')
          res.body.should.include.keys('email', 'verified')
          res.body.verified.should.equal(true)
          done()
        })
    })
  })

  describe('/POST change', () => {
    it('it should POST change', (done) => {
      chai
        .request(server)
        .post('/change')
        .send({
          email: testEmail
        })
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.an('object')
          res.body.should.include.keys('msg', 'verification')
          verificationChange = res.body.verification
          done()
        })
    })
  })

  describe('/POST reset', () => {
    it('it should POST reset', (done) => {
      const newPrivateKey = createFakePrivateKey(12)
      const newAddress = createRewardAddress(newPrivateKey)
      const newCoseKey = createCOSEKey(newPrivateKey)
      const newCoseSign1 = createCOSESign1Signature(
        { host, action: 'Reset', timestamp: Date.now(), url: host + '/reset' },
        newAddress,
        newPrivateKey
      )
      chai
        .request(server)
        .post('/reset')
        .send({
          id: verificationChange,
          walletAddress: newAddress.to_address().to_bech32(),
          key: Buffer.from(newCoseKey.to_bytes()).toString('hex'),
          signature: Buffer.from(newCoseSign1.to_bytes()).toString('hex')
        })
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('msg').eql('WALLET_CHANGED')
          done()
        })
    })
  })

  describe('/GET token', () => {
    it('it should NOT be able to consume the route since no token was sent', (done) => {
      chai
        .request(server)
        .get('/token')
        .end((err, res) => {
          res.should.have.status(401)
          done()
        })
    })
    it('it should GET a fresh token', (done) => {
      chai
        .request(server)
        .get('/token')
        .set('Cookie', refreshTokenCookie)
        .set('Authorization', `Bearer ${accessToken}`)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.an('object')
          res.body.should.have.property('accessToken')
          done()
        })
    })
  })

  describe('/POST register', () => {
    it('it should POST register user 2', (done) => {
      const user = {
        name: anotherUser.name,
        email: anotherUser.email,
        walletAddress: stakeAddress2.to_address().to_bech32(),
        key: Buffer.from(createCOSEKey(stakePrivateKey2).to_bytes()).toString(
          'hex'
        ),
        signature: Buffer.from(
          createRegisterUserSignature(
            anotherUser.name,
            anotherUser.email,
            stakeAddress2,
            stakePrivateKey2
          ).to_bytes()
        ).toString('hex')
      }
      chai
        .request(server)
        .post('/register')
        .send(user)
        .end((err, res) => {
          res.should.have.status(201)
          res.body.should.be.an('object')
          res.body.should.include.keys('accessToken', 'user')
          createdID.push(res.body.user._id)
          done()
        })
    })
  })

  describe('/GET logout', () => {
    it('should logout', (done) => {
      chai
        .request(server)
        .get('/logout')
        .end((err, res) => {
          res.should.not.has.cookie('jwt')
          done()
        })
    })
  })

  after((done) => {
    createdID.forEach((id) => {
      User.findByIdAndRemove(id, (err) => {
        if (err) {
          console.log(err)
        }
      })
    })
    done()
  })
})
