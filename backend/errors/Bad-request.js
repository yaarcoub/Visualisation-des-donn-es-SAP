const { StatusCodes } = require('http-status-codes');
const SpesifieError = require('../errors/SpesifieError');

class BadRequestError extends SpesifieError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

module.exports = BadRequestError;