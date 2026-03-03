const { StatusCodes } = require('http-status-codes');
const SpesifieError = require('../errors/SpesifieError');

class UnauthenticatedError extends SpesifieError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}


module.exports = UnauthenticatedError;