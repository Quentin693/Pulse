const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    variantId: mongoose.Schema.Types.ObjectId,
    name: String,
    variantName: String,
    image: String,
    priceCents: Number,
    quantity: Number,
  },
  { _id: false }
);

const addressSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    reference: { type: String, required: true, unique: true },
    items: { type: [orderItemSchema], default: [] },
    subtotalCents: { type: Number, required: true },
    shippingCents: { type: Number, default: 0 },
    totalCents: { type: Number, required: true },
    currency: { type: String, default: 'EUR' },
    address: { type: addressSchema, required: true },
    status: {
      type: String,
      enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
      default: 'paid',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
