const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email'],
    },
    passwordHash: { type: String, required: true, select: false },
    handle: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 24,
      match: [/^[a-z0-9_-]+$/, 'Handle must be lowercase alphanumeric'],
    },
    displayName: { type: String, required: true, trim: true, maxlength: 60 },
    bio: { type: String, default: '', maxlength: 280 },
    avatarUrl: { type: String, default: '' },
    bannerUrl: { type: String, default: '' },
    location: { type: String, default: '' },
    sports: { type: [String], default: [] },
    goals: { type: [String], default: [] },
    publicProfile: { type: Boolean, default: true },
    socials: {
      instagram: { type: String, default: '' },
      strava: { type: String, default: '' },
      website: { type: String, default: '' },
    },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
  },
  { timestamps: true }
);

userSchema.methods.setPassword = async function setPassword(plain) {
  this.passwordHash = await bcrypt.hash(plain, 10);
};

userSchema.methods.checkPassword = function checkPassword(plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

userSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: this._id,
    handle: this.handle,
    displayName: this.displayName,
    bio: this.bio,
    avatarUrl: this.avatarUrl,
    bannerUrl: this.bannerUrl,
    location: this.location,
    sports: this.sports,
    goals: this.goals,
    socials: this.socials,
    publicProfile: this.publicProfile,
  };
};

userSchema.methods.toPrivateJSON = function toPrivateJSON() {
  return {
    ...this.toPublicJSON(),
    email: this.email,
    role: this.role,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('User', userSchema);
