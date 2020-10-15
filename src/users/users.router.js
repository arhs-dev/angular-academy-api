const { authorize, authorizeProfile } = require('../auth/auth.middleware');
const { collection } = require('../database/collection');
const { signup, signin, updateUser } = require('./users.controller');

const router = require('express').Router();

router.post('/', signup);
router.post('/signin', signin);
router.put('/:id', authorize, authorizeProfile, updateUser);

exports.usersRouter = router;
