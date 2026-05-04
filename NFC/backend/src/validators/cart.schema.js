const Joi = require('joi');

const addItemSchema = Joi.object({
  productId: Joi.string().required(),
  variantId: Joi.string().required(),
  quantity: Joi.number().integer().min(1).max(20).default(1),
});

const updateItemSchema = Joi.object({
  quantity: Joi.number().integer().min(1).max(20).required(),
});

module.exports = { addItemSchema, updateItemSchema };
