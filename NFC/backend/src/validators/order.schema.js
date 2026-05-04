const Joi = require('joi');

const checkoutSchema = Joi.object({
  address: Joi.object({
    fullName: Joi.string().min(2).max(100).required(),
    street: Joi.string().min(2).max(120).required(),
    city: Joi.string().min(2).max(60).required(),
    zip: Joi.string().min(2).max(20).required(),
    country: Joi.string().min(2).max(60).required(),
  }).required(),
});

module.exports = { checkoutSchema };
