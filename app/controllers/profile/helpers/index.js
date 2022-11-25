const { findUser } = require('./findUser')
const { getProfileFromDB } = require('./getProfileFromDB')
const { updateProfileInDB } = require('./updateProfileInDB')

module.exports = {
  findUser,
  getProfileFromDB,
  updateProfileInDB
}
