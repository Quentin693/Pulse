const User = require('../models/User');
const Cart = require('../models/Cart');
const { signUserToken } = require('../services/token.service');
const { conflict, unauthorized } = require('../utils/ApiError');

async function register(req, res) {
  const { email, password, handle, displayName } = req.body;

  const existingEmail = await User.findOne({ email });
  if (existingEmail) throw conflict('Email already in use');

  const existingHandle = await User.findOne({ handle });
  if (existingHandle) throw conflict('Handle already taken');

  const user = new User({ email, handle, displayName });
  await user.setPassword(password);
  await user.save();
  await Cart.create({ user: user._id, items: [] });

  const token = signUserToken(user);
  res.status(201).json({ token, user: user.toPrivateJSON() });
}

async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user) throw unauthorized('Invalid credentials');
  const ok = await user.checkPassword(password);
  if (!ok) throw unauthorized('Invalid credentials');
  const token = signUserToken(user);
  res.json({ token, user: user.toPrivateJSON() });
}

async function me(req, res) {
  res.json({ user: req.user.toPrivateJSON() });
}

module.exports = { register, login, me };
