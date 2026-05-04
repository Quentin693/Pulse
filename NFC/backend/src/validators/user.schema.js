const Joi = require('joi');

const updateProfileSchema = Joi.object({
  displayName: Joi.string().min(2).max(60),
  bio: Joi.string().allow('').max(280),
  avatarUrl: Joi.string().allow('').uri({ allowRelative: true }),
  bannerUrl: Joi.string().allow('').uri({ allowRelative: true }),
  location: Joi.string().allow('').max(80),
  sports: Joi.array().items(Joi.string().max(40)).max(10),
  goals: Joi.array().items(Joi.string().max(80)).max(10),
  publicProfile: Joi.boolean(),
  socials: Joi.object({
    instagram: Joi.string().allow('').max(60),
    strava: Joi.string().allow('').max(60),
    website: Joi.string().allow('').max(120),
  }),
});

module.exports = { updateProfileSchema };
