const Cart = require('../models/Cart');
const Order = require('../models/Order');
const { badRequest, notFound } = require('../utils/ApiError');

function makeReference() {
  return `PULSE-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`;
}

async function checkout(req, res) {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart || cart.items.length === 0) throw badRequest('Cart is empty');

  const items = cart.items.map((item) => ({
    product: item.product,
    variantId: item.variantId,
    name: item.snapshot.name,
    variantName: item.snapshot.variantName,
    image: item.snapshot.image,
    priceCents: item.snapshot.priceCents,
    quantity: item.quantity,
  }));

  const subtotalCents = items.reduce((s, i) => s + i.priceCents * i.quantity, 0);
  const shippingCents = subtotalCents > 9900 ? 0 : 490;
  const totalCents = subtotalCents + shippingCents;

  const order = await Order.create({
    user: req.user._id,
    reference: makeReference(),
    items,
    subtotalCents,
    shippingCents,
    totalCents,
    address: req.body.address,
  });

  cart.items = [];
  await cart.save();

  res.status(201).json({ order });
}

async function listMine(req, res) {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ items: orders });
}

async function getOne(req, res) {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
  if (!order) throw notFound('Order not found');
  res.json({ order });
}

module.exports = { checkout, listMine, getOne };
