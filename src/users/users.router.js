const { authorize, authorizeProfile } = require('../auth/auth.middleware');
const { signup, signin, updateUser } = require('./users.controller');

const router = require('express').Router();

router.post('/', signup);
router.post('/signin', signin);
router.put(
  '/:id',
  authorize,
  (req, res, next) => authorizeProfile(req.params.id, req, res, next),
  updateUser,
);

exports.usersRouter = router;
