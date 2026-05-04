const { ApiError } = require('../utils/ApiError');

module.exports = function errorHandler(err, req, res, _next) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({
      error: { message: err.message, details: err.details || null },
    });
  }

  if (err.name === 'ValidationError') {
    const details = Object.fromEntries(
      Object.entries(err.errors || {}).map(([k, v]) => [k, v.message])
    );
    return res.status(400).json({ error: { message: 'Validation failed', details } });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      error: { message: 'Duplicate value', details: err.keyValue || null },
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ error: { message: `Invalid ${err.path}: ${err.value}` } });
  }

  if (process.env.NODE_ENV !== 'test') {
    console.error('[unhandled]', err);
  }

  res.status(500).json({
    error: { message: 'Internal server error' },
  });
};
