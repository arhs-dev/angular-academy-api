const { withErrorHandling } = require('../error-handler');
const { getMovies, getMovieById, createMovie } = require('./movies.controller');

const router = require('express').Router();

router.get('/', withErrorHandling(getMovies));
router.get('/:id', withErrorHandling(getMovieById));
router.post('/', withErrorHandling(createMovie));

exports.moviesRouter = router;
