const { verifyJwt } = require('./auth.service');
const { StatusCodes, ReasonPhrases } = require('http-status-codes');

exports.authorize = (req, res, next) => {
  try {
    verifyJwt(req.get('token'));
    next();
  } catch (e) {
    console.log(e);
    throw {
      status: StatusCodes.UNAUTHORIZED,
      message: ReasonPhrases.UNAUTHORIZED,
    };
  }
};
