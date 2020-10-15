const { withErrorHandling } = require('../error-handler');
const { getMovies, getMovieById, createMovie } = require('./movies.controller');
const { authorize } = require('../auth/auth.middleware');

const router = require('express').Router();

router.get('/', authorize, withErrorHandling(getMovies));
router.get('/:id', authorize, withErrorHandling(getMovieById));
router.post('/', authorize, withErrorHandling(createMovie));

exports.moviesRouter = router;
