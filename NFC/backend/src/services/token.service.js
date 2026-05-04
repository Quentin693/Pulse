const jwt = require('jsonwebtoken');
const env = require('../config/env');

function signUserToken(user) {
  return jwt.sign({ sub: user._id.toString(), handle: user.handle }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
}

module.exports = { signUserToken };
