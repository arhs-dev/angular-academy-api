const { sign, verify } = require('jsonwebtoken');
const { config } = require('dotenv');

exports.signJwt = (payload) => {
  return sign(payload, config().parsed.SECRET_KEY, { expiresIn: '2h' });
};

exports.verifyJwt = (jwt) => {
  return verify(jwt, config().parsed.SECRET_KEY);
};
