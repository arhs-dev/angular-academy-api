const { getMovies, getMovieById, createMovie, updateMovie } = require('./movies.controller');
const { authorize } = require('../auth/auth.middleware');

const router = require('express').Router();

router.get('/', authorize, getMovies);
router.get('/:id', authorize, getMovieById);
router.post('/', authorize, createMovie);
router.put('/:id', authorize, updateMovie);

exports.moviesRouter = router;
