const Joi = require('joi');

const createBraceletSchema = Joi.object({
  tagId: Joi.string().alphanum().min(4).max(40).required(),
  nickname: Joi.string().max(40),
  color: Joi.string().max(20),
  edition: Joi.string().max(40),
  mode: Joi.string().valid('profile', 'workout', 'custom'),
  targetUrl: Joi.string().allow('').uri({ allowRelative: true }),
});

const updateBraceletSchema = Joi.object({
  nickname: Joi.string().max(40),
  color: Joi.string().max(20),
  edition: Joi.string().max(40),
  active: Joi.boolean(),
  mode: Joi.string().valid('profile', 'workout', 'custom'),
  targetUrl: Joi.string().allow('').uri({ allowRelative: true }),
});

module.exports = { createBraceletSchema, updateBraceletSchema };
