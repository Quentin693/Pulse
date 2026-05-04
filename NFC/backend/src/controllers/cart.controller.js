const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { notFound, badRequest } = require('../utils/ApiError');

async function getOrCreate(userId) {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  return cart;
}

async function getMine(req, res) {
  const cart = await getOrCreate(req.user._id);
  res.json({ cart });
}

async function addItem(req, res) {
  const { productId, variantId, quantity } = req.body;
  const product = await Product.findById(productId);
  if (!product) throw notFound('Product not found');
  const variant = product.variants.id(variantId);
  if (!variant) throw badRequest('Invalid variant');

  const cart = await getOrCreate(req.user._id);
  const existing = cart.items.find(
    (item) =>
      item.product.toString() === productId && item.variantId.toString() === variantId
  );
  if (existing) {
    existing.quantity = Math.min(20, existing.quantity + quantity);
  } else {
    cart.items.push({
      product: product._id,
      variantId: variant._id,
      quantity,
      snapshot: {
        name: product.name,
        variantName: variant.name,
        priceCents: variant.priceCents,
        image: product.images[0] || '',
      },
    });
  }
  await cart.save();
  res.status(201).json({ cart });
}

async function updateItem(req, res) {
  const cart = await getOrCreate(req.user._id);
  const item = cart.items.id(req.params.itemId);
  if (!item) throw notFound('Item not found in cart');
  item.quantity = req.body.quantity;
  await cart.save();
  res.json({ cart });
}

async function removeItem(req, res) {
  const cart = await getOrCreate(req.user._id);
  const item = cart.items.id(req.params.itemId);
  if (!item) throw notFound('Item not found in cart');
  item.deleteOne();
  await cart.save();
  res.json({ cart });
}

async function clear(req, res) {
  const cart = await getOrCreate(req.user._id);
  cart.items = [];
  await cart.save();
  res.json({ cart });
}

module.exports = { getMine, addItem, updateItem, removeItem, clear };
