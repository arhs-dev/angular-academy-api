const { signJwt } = require('../auth/auth.service');
const {
  signupUser,
  signinUser,
  updateUser,
  getUserFavorites,
  createUserFavorite,
  removeUserFavorite,
  getUserById,
  deleteUserById,
} = require('./users.service');
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

exports.getUserDetails = withErrorHandling(async (req, res, next) => {
  const user = await getUserById(res.locals.userId);
  res.json(user);
});

exports.updateUser = withErrorHandling(async (req, res, next) => {
  const updatedUser = await updateUser(res.locals.userId, req.body);
  res.json(updatedUser);
});

exports.deleteUserById = withErrorHandling(async (req, res, next) => {
  await deleteUserById(res.locals.userId, req.body);
  res.json({ deleted: 'ok' });
});

exports.getUserFavorites = withErrorHandling(async (req, res, next) => {
  const favorites = await getUserFavorites(res.locals.userId);
  res.json(favorites);
});

exports.createUserFavorite = withErrorHandling(async (req, res, next) => {
  const favoriteMovie = await createUserFavorite(res.locals.userId, req.body.movieId);
  res.json(favoriteMovie);
});

exports.removeUserFavorite = withErrorHandling(async (req, res, next) => {
  await removeUserFavorite(req.params.id);
  res.json({ deleted: 'ok' });
});
