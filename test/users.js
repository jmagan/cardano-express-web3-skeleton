/* eslint handle-callback-err: "off"*/

process.env.NODE_ENV = 'test'

const User = require('../app/models/user')
const faker = require('faker')
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')
const {
  getAdminLoginDetails,
  getUserLoginDetails,
  createFakePrivateKey,
  createRewardAddress
} = require('./helpers/auth')
// eslint-disable-next-line no-unused-vars
const should = chai.should()
const host = 'HOST'
const loginDetails = {
  admin: getAdminLoginDetails(host),
  user: getUserLoginDetails(host)
}

const adminPrivateKey = createFakePrivateKey(0)
const adminStakeAddress = createRewardAddress(adminPrivateKey)

const tokens = {
  admin: '',
  user: ''
}

const email = faker.internet.email()
const createdID = []

chai.use(chaiHttp)

describe('*********** USERS ***********', () => {
  describe('/POST login', () => {
    it('it should GET token as admin', (done) => {
      chai
        .request(server)
        .post('/login')
        .send(loginDetails.admin)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.an('object')
          res.body.should.have.property('accessToken')
          tokens.admin = res.body.accessToken
          done()
        })
    })
    it('it should GET token as user', (done) => {
      chai
        .request(server)
        .post('/login')
        .send(loginDetails.user)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.an('object')
          res.body.should.have.property('accessToken')
          tokens.user = res.body.accessToken
          done()
        })
    })
  })
  describe('/GET users', () => {
    it('it should NOT be able to consume the route since no token was sent', (done) => {
      chai
        .request(server)
        .get('/users')
        .end((err, res) => {
          res.should.have.status(401)
          done()
        })
    })
    it('it should GET all the users', (done) => {
      chai
        .request(server)
        .get('/users')
        .set('Authorization', `Bearer ${tokens.admin}`)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.an('object')
          res.body.docs.should.be.a('array')
          done()
        })
    })
    it('it should GET the users with filters', (done) => {
      chai
        .request(server)
        .get('/users?filter=admin&fields=email')
        .set('Authorization', `Bearer ${tokens.admin}`)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.an('object')
          res.body.docs.should.be.a('array')
          res.body.docs.should.have.lengthOf(1)
          res.body.docs[0].should.have.property('email').eql('admin@admin.com')
          done()
        })
    })
  })
  describe('/POST user', () => {
    it('it should NOT POST a user without name', (done) => {
      const user = {}
      chai
        .request(server)
        .post('/users')
        .set('Authorization', `Bearer ${tokens.admin}`)
        .send(user)
        .end((err, res) => {
          res.should.have.status(422)
          res.body.should.be.a('object')
          res.body.should.have.property('errors')
          done()
        })
    })
    it('it should POST a user ', (done) => {
      const user = {
        name: faker.random.words(),
        email,
        walletAddress: faker.random.words(),
        role: 'admin',
        urlTwitter: faker.internet.url(),
        urlGitHub: faker.internet.url(),
        phone: faker.phone.phoneNumber(),
        city: faker.random.words(),
        country: faker.random.words()
      }
      chai
        .request(server)
        .post('/users')
        .set('Authorization', `Bearer ${tokens.admin}`)
        .send(user)
        .end((err, res) => {
          res.should.have.status(201)
          res.body.should.be.a('object')
          res.body.should.include.keys('_id', 'name', 'email', 'verification')
          createdID.push(res.body._id)
          done()
        })
    })
    it('it should NOT POST a user with email that already exists', (done) => {
      const user = {
        name: faker.random.words(),
        email,
        password: faker.random.words(),
        role: 'admin',
        walletAddress: faker.random.alphaNumeric(23),
        phone: '1234',
        country: 'Country',
        city: 'City'
      }
      chai
        .request(server)
        .post('/users')
        .set('Authorization', `Bearer ${tokens.admin}`)
        .send(user)
        .end((err, res) => {
          res.should.have.status(422)
          res.body.should.be.a('object')
          res.body.should.have.property('errors')
          done()
        })
    })
    it('it should NOT POST a user with wallet address that already exists', (done) => {
      const user = {
        name: faker.random.words(),
        email: faker.internet.email(),
        password: faker.random.words(),
        walletAddress: adminStakeAddress.to_address().to_bech32(),
        role: 'admin',
        phone: '1234',
        country: 'Country',
        city: 'City'
      }
      chai
        .request(server)
        .post('/users')
        .set('Authorization', `Bearer ${tokens.admin}`)
        .send(user)
        .end((err, res) => {
          res.should.have.status(422)
          res.body.should.be.a('object')
          res.body.should.have.property('errors')
          done()
        })
    })
    it('it should NOT POST a user with not known role', (done) => {
      const user = {
        name: faker.random.words(),
        email,
        password: faker.random.words(),
        role: faker.random.words()
      }
      chai
        .request(server)
        .post('/users')
        .set('Authorization', `Bearer ${tokens.admin}`)
        .send(user)
        .end((err, res) => {
          res.should.have.status(422)
          res.body.should.be.a('object')
          res.body.should.have.property('errors')
          done()
        })
    })
  })
  describe('/GET/:id user', () => {
    it('it should GET a user by the given id', (done) => {
      const id = createdID.slice(-1).pop()
      chai
        .request(server)
        .get(`/users/${id}`)
        .set('Authorization', `Bearer ${tokens.admin}`)
        .end((error, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('name')
          res.body.should.have.property('_id').eql(id)
          done()
        })
    })
  })
  describe('/PATCH/:id user', () => {
    it('it should UPDATE a user given the id', (done) => {
      const id = createdID.slice(-1).pop()
      const user = {
        name: 'JS123456',
        email: 'emailthatalreadyexists@email.com',
        role: 'admin',
        urlTwitter: faker.internet.url(),
        urlGitHub: faker.internet.url(),
        phone: faker.phone.phoneNumber(),
        city: faker.random.words(),
        country: faker.random.words()
      }
      chai
        .request(server)
        .patch(`/users/${id}`)
        .set('Authorization', `Bearer ${tokens.admin}`)
        .send(user)
        .end((error, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('_id').eql(id)
          res.body.should.have.property('name').eql('JS123456')
          res.body.should.have
            .property('email')
            .eql('emailthatalreadyexists@email.com')
          createdID.push(res.body._id)
          done()
        })
    })
    it('it should NOT UPDATE a user with email that already exists', (done) => {
      const id = createdID.slice(-1).pop()
      const user = {
        name: faker.random.words(),
        email: 'admin@admin.com',
        role: 'admin',
        phone: '1234',
        country: 'Country',
        city: 'City'
      }
      chai
        .request(server)
        .patch(`/users/${id}`)
        .set('Authorization', `Bearer ${tokens.admin}`)
        .send(user)
        .end((err, res) => {
          res.should.have.status(422)
          res.body.should.be.a('object')
          res.body.should.have.property('errors')
          done()
        })
    })
    it('it should NOT UPDATE another user if not an admin', (done) => {
      const id = createdID.slice(-1).pop()
      const user = {
        name: faker.random.words(),
        email: 'toto@toto.com',
        role: 'user'
      }
      chai
        .request(server)
        .patch(`/users/${id}`)
        .set('Authorization', `Bearer ${tokens.user}`)
        .send(user)
        .end((err, res) => {
          res.should.have.status(401)
          res.body.should.be.a('object')
          res.body.should.have.property('errors')
          done()
        })
    })
  })
  describe('/DELETE/:id user', () => {
    it('it should DELETE a user given the id', (done) => {
      const user = {
        name: faker.random.words(),
        email,
        walletAddress: faker.random.words(),
        role: 'admin',
        urlTwitter: faker.internet.url(),
        urlGitHub: faker.internet.url(),
        phone: faker.phone.phoneNumber(),
        city: faker.random.words(),
        country: faker.random.words()
      }
      chai
        .request(server)
        .post('/users')
        .set('Authorization', `Bearer ${tokens.admin}`)
        .send(user)
        .end((err, res) => {
          res.should.have.status(201)
          res.body.should.be.a('object')
          res.body.should.include.keys('_id', 'name', 'email', 'verification')
          chai
            .request(server)
            .delete(`/users/${res.body._id}`)
            .set('Authorization', `Bearer ${tokens.admin}`)
            .end((error, result) => {
              result.should.have.status(200)
              result.body.should.be.a('object')
              result.body.should.have.property('msg').eql('DELETED')
              done()
            })
        })
    })
  })

  after(() => {
    createdID.forEach((id) => {
      User.findByIdAndRemove(id, (err) => {
        if (err) {
          console.log(err)
        }
      })
    })
  })
})
