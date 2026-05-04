const Joi = require('joi');

const TYPES = ['running', 'cycling', 'walking', 'strength', 'yoga', 'hiit', 'swimming', 'other'];

const createActivitySchema = Joi.object({
  type: Joi.string().valid(...TYPES).required(),
  title: Joi.string().min(2).max(80).required(),
  notes: Joi.string().allow('').max(500),
  durationMin: Joi.number().integer().min(1).max(24 * 60).required(),
  distanceKm: Joi.number().min(0).max(1000).default(0),
  calories: Joi.number().min(0).max(20000).default(0),
  avgHeartRate: Joi.number().min(0).max(250).default(0),
  intensity: Joi.string().valid('low', 'medium', 'high').default('medium'),
  performedAt: Joi.date().default(() => new Date()),
});

const updateActivitySchema = createActivitySchema.fork(
  ['type', 'title', 'durationMin'],
  (s) => s.optional()
);

module.exports = { createActivitySchema, updateActivitySchema };
