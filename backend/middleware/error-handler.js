const  SpesifieError  = require('../errors/SpesifieError')
const { StatusCodes } = require('http-status-codes')
const BadRequestError = require('../errors/Bad-request');
const unauthenticated = require('../errors/Bad-request');

const errorHandlerMiddleware = (err, req, res, next) => {
  

  if (err instanceof SpesifieError ) {
      return res.status(err.statusCode).json({ msg: err.message })
  }
 
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg:'An error occurred ',err })
  
}

module.exports = errorHandlerMiddleware