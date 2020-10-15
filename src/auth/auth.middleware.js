const { verifyJwt } = require('./auth.service');
const { StatusCodes, ReasonPhrases } = require('http-status-codes');

exports.authorize = (req, res, next) => {
  try {
    const { username, id } = verifyJwt(req.get('token'));
    res.locals.username = username;
    res.locals.id = id;

    next();
  } catch (e) {
    console.log(e);
    throw {
      status: StatusCodes.UNAUTHORIZED,
      message: ReasonPhrases.UNAUTHORIZED,
    };
  }
};

exports.authorizeProfile = (idToMatch, req, res, next) => {
  if (idToMatch !== res.locals.id) {
    throw {
      status: StatusCodes.UNAUTHORIZED,
      message: ReasonPhrases.UNAUTHORIZED,
    };
  }

  next();
};
