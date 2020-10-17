const { sign, verify } = require('jsonwebtoken');

exports.signJwt = (payload) => {
  return sign(payload, 'secret-key', { expiresIn: '2h' });
};

exports.verifyJwt = (jwt) => {
  return verify(jwt, 'secret-key');
};
