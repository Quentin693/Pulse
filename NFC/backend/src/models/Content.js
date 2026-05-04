const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, lowercase: true, trim: true },
    type: {
      type: String,
      enum: ['hero', 'section', 'faq', 'testimonial', 'feature'],
      default: 'section',
    },
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    body: { type: String, default: '' },
    items: { type: Array, default: [] },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Content', contentSchema);
