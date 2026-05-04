const Content = require('../models/Content');

async function list(req, res) {
  const filter = {};
  if (req.query.type) filter.type = req.query.type;
  const items = await Content.find(filter).sort({ order: 1, createdAt: 1 });
  res.json({ items });
}

async function getByKey(req, res) {
  const item = await Content.findOne({ key: req.params.key.toLowerCase() });
  res.json({ item: item || null });
}

module.exports = { list, getByKey };
