class ApiError extends Error {
  constructor(status, message, details = null) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

const badRequest = (msg, details) => new ApiError(400, msg, details);
const unauthorized = (msg = 'Unauthorized') => new ApiError(401, msg);
const forbidden = (msg = 'Forbidden') => new ApiError(403, msg);
const notFound = (msg = 'Not found') => new ApiError(404, msg);
const conflict = (msg, details) => new ApiError(409, msg, details);

module.exports = { ApiError, badRequest, unauthorized, forbidden, notFound, conflict };
