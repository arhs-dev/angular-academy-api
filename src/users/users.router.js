const { authorize, authorizeProfile } = require('../auth/auth.middleware');
const {
  signup,
  signin,
  updateUser,
  getUserFavorites,
  createUserFavorite,
  removeUserFavorite,
} = require('./users.controller');

const router = require('express').Router();

router.post('/', signup);
router.post('/signin', signin);
router.put(
  '/:id',
  authorize,
  (req, res, next) => authorizeProfile(req.params.id, req, res, next),
  updateUser,
);
router.get(
  '/:userId/favorites',
  authorize,
  (req, res, next) => authorizeProfile(req.params.userId, req, res, next),
  getUserFavorites,
);
router.post(
  '/:userId/favorites',
  authorize,
  (req, res, next) => authorizeProfile(req.params.userId, req, res, next),
  createUserFavorite,
);
router.delete(
  '/:userId/favorites/:id',
  authorize,
  (req, res, next) => authorizeProfile(req.params.userId, req, res, next),
  removeUserFavorite,
);

exports.usersRouter = router;
