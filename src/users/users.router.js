const { authorize } = require('../auth/auth.middleware');
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
router.put('/:id', authorize, updateUser);
router.get('/favorites', authorize, getUserFavorites);
router.post('/favorites', authorize, createUserFavorite);
router.delete('/favorites/:id', authorize, removeUserFavorite);

exports.usersRouter = router;
