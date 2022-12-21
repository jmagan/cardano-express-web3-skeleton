/**
 * Login function called by route
 * @param {import('express').Request} req - request object
 * @param {import('express').Response} res - response object
 */
const logout = async (_, res) => {
  res.clearCookie('jwt')
  res.status(200).send('Logout successful')
}

module.exports = { logout }
