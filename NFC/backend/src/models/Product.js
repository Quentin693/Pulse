const mongoose = require('mongoose');
const slugify = require('slugify');

const variantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    color: { type: String, default: '' },
    size: { type: String, default: '' },
    sku: { type: String, required: true },
    priceCents: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 100, min: 0 },
  },
  { _id: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    slug: { type: String, required: true, unique: true, lowercase: true },
    tagline: { type: String, default: '', maxlength: 120 },
    description: { type: String, required: true },
    highlights: { type: [String], default: [] },
    images: { type: [String], default: [] },
    basePriceCents: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'EUR' },
    category: { type: String, default: 'bracelet' },
    featured: { type: Boolean, default: false },
    variants: { type: [variantSchema], default: [] },
  },
  { timestamps: true }
);

productSchema.pre('validate', function presave(next) {
  if (this.name && !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
