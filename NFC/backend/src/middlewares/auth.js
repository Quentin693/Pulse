const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/User');
const { unauthorized } = require('../utils/ApiError');

async function requireAuth(req, _res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next(unauthorized('Missing token'));

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(payload.sub);
    if (!user) return next(unauthorized('Invalid token'));
    req.user = user;
    next();
  } catch (_err) {
    next(unauthorized('Invalid or expired token'));
  }
}

function optionalAuth(req, _res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next();
  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.userId = payload.sub;
  } catch (_err) {
    /* ignore */
  }
  next();
}

module.exports = { requireAuth, optionalAuth };
