const { StatusCodes } = require('http-status-codes');
const SpesifieError = require('../errors/SpesifieError');

class NotFoundError extends SpesifieError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}


module.exports = NotFoundError;