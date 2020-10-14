const { authorize } = require('../auth/auth.middleware');
const { collection } = require('../database/collection');
// const { collection } = require('../config');
const { signup, signin } = require('./users.controller');

const router = require('express').Router();

router.post('/', signup);
router.post('/signin', signin);

exports.usersRouter = router;
