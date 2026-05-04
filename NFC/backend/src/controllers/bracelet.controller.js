const NFCBracelet = require('../models/NFCBracelet');
const { notFound, conflict } = require('../utils/ApiError');

async function list(req, res) {
  const items = await NFCBracelet.find({ owner: req.user._id }).sort({ createdAt: -1 });
  res.json({ items: items.map((b) => b.toJSONClient()) });
}

async function create(req, res) {
  const tagId = req.body.tagId.toUpperCase();
  const exists = await NFCBracelet.findOne({ tagId });
  if (exists) throw conflict('This bracelet is already linked');
  const bracelet = await NFCBracelet.create({ ...req.body, tagId, owner: req.user._id });
  res.status(201).json({ bracelet: bracelet.toJSONClient() });
}

async function update(req, res) {
  const bracelet = await NFCBracelet.findOne({ _id: req.params.id, owner: req.user._id });
  if (!bracelet) throw notFound('Bracelet not found');
  Object.assign(bracelet, req.body);
  await bracelet.save();
  res.json({ bracelet: bracelet.toJSONClient() });
}

async function remove(req, res) {
  const bracelet = await NFCBracelet.findOneAndDelete({
    _id: req.params.id,
    owner: req.user._id,
  });
  if (!bracelet) throw notFound('Bracelet not found');
  res.json({ ok: true });
}

module.exports = { list, create, update, remove };
