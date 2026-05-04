const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: {
      type: String,
      required: true,
      enum: ['running', 'cycling', 'walking', 'strength', 'yoga', 'hiit', 'swimming', 'other'],
    },
    title: { type: String, required: true, trim: true, maxlength: 80 },
    notes: { type: String, default: '', maxlength: 500 },
    durationMin: { type: Number, required: true, min: 1, max: 24 * 60 },
    distanceKm: { type: Number, default: 0, min: 0 },
    calories: { type: Number, default: 0, min: 0 },
    avgHeartRate: { type: Number, default: 0, min: 0, max: 250 },
    intensity: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    performedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

activitySchema.index({ user: 1, performedAt: -1 });

module.exports = mongoose.model('Activity', activitySchema);
