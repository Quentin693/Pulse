const Activity = require('../models/Activity');
const { notFound } = require('../utils/ApiError');

async function list(req, res) {
  const limit = Math.min(parseInt(req.query.limit, 10) || 50, 200);
  const items = await Activity.find({ user: req.user._id })
    .sort({ performedAt: -1 })
    .limit(limit);
  res.json({ items });
}

async function create(req, res) {
  const activity = await Activity.create({ ...req.body, user: req.user._id });
  res.status(201).json({ activity });
}

async function update(req, res) {
  const activity = await Activity.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!activity) throw notFound('Activity not found');
  res.json({ activity });
}

async function remove(req, res) {
  const activity = await Activity.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!activity) throw notFound('Activity not found');
  res.json({ ok: true });
}

module.exports = { list, create, update, remove };
