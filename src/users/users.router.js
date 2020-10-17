const { authorize } = require('../auth/auth.middleware');
const {
  signup,
  signin,
  updateUser,
  getUserFavorites,
  createUserFavorite,
  removeUserFavorite,
  getUserDetails,
  deleteUserById,
} = require('./users.controller');

const router = require('express').Router();

router.get('/details', authorize, getUserDetails);
router.post('/', signup);
router.post('/signin', signin);
router.put('/', authorize, updateUser);
router.delete('/', authorize, deleteUserById);
router.get('/favorites', authorize, getUserFavorites);
router.post('/favorites', authorize, createUserFavorite);
router.delete('/favorites/:id', authorize, removeUserFavorite);

exports.usersRouter = router;
