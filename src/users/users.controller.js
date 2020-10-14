const { signJwt } = require('../auth/auth.service');
const { signupUser, signinUser } = require('./users.service');
const { withErrorHandling } = require('../error-handler');

exports.signup = withErrorHandling(async (req, res, next) => {
  const user = await signupUser(req.body);
  const jwt = signJwt(user);
  res.json({ user, jwt });
});

exports.signin = withErrorHandling(async (req, res, next) => {
  const user = await signinUser(req.body);
  const jwt = signJwt(user);
  res.json({ user, jwt });
});
