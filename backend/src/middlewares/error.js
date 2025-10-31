const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const errorConverter = (err, req, res, next) => {
  if (!(err instanceof ApiError)) {
    const statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    const message = err.message || httpStatus[statusCode];
    err = new ApiError(statusCode, message);
  }
  next(err);
};

const errorHandler = (err, req, res, next) => {
  const { statusCode = httpStatus.INTERNAL_SERVER_ERROR, message, details } = err;
  res.status(statusCode).json({
    code: statusCode,
    message,
    details,
  });
};

module.exports = {
  errorConverter,
  errorHandler,
};
