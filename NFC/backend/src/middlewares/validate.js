const { badRequest } = require('../utils/ApiError');

function validate(schema, source = 'body') {
  return (req, _res, next) => {
    const { value, error } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      const details = Object.fromEntries(
        error.details.map((d) => [d.path.join('.'), d.message])
      );
      return next(badRequest('Validation failed', details));
    }
    req[source] = value;
    next();
  };
}

module.exports = validate;
