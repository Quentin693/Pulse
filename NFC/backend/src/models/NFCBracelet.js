const mongoose = require('mongoose');

const braceletSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tagId: { type: String, required: true, unique: true, trim: true, uppercase: true },
    nickname: { type: String, default: 'Mon PULSE', maxlength: 40 },
    color: { type: String, default: 'cyan' },
    edition: { type: String, default: 'Core' },
    active: { type: Boolean, default: true },
    targetUrl: { type: String, default: '' },
    mode: {
      type: String,
      enum: ['profile', 'workout', 'custom'],
      default: 'profile',
    },
    tapCount: { type: Number, default: 0 },
    lastTapAt: { type: Date, default: null },
  },
  { timestamps: true }
);

braceletSchema.methods.toJSONClient = function toJSONClient() {
  return {
    id: this._id,
    tagId: this.tagId,
    nickname: this.nickname,
    color: this.color,
    edition: this.edition,
    active: this.active,
    targetUrl: this.targetUrl,
    mode: this.mode,
    tapCount: this.tapCount,
    lastTapAt: this.lastTapAt,
  };
};

module.exports = mongoose.model('NFCBracelet', braceletSchema);
