const Product = require('../models/Product');
const { notFound } = require('../utils/ApiError');

async function list(req, res) {
  const filter = {};
  if (req.query.featured === 'true') filter.featured = true;
  if (req.query.category) filter.category = req.query.category;
  const items = await Product.find(filter).sort({ featured: -1, createdAt: -1 });
  res.json({ items });
}

async function getBySlug(req, res) {
  const product = await Product.findOne({ slug: req.params.slug });
  if (!product) throw notFound('Product not found');
  res.json({ product });
}

module.exports = { list, getBySlug };
