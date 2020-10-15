const {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
} = require('./movies.controller');
const { authorize } = require('../auth/auth.middleware');

const router = require('express').Router();

router.get('/', authorize, getMovies);
router.get('/:id', authorize, getMovieById);
router.post('/', authorize, createMovie);
router.put('/:id', authorize, updateMovie);
router.delete('/:id', authorize, deleteMovie);

exports.moviesRouter = router;
