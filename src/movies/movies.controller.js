const { retrieveMovies, retrieveMovieByid, createMovie, updateMovie } = require('./movies.service');
const { ReasonPhrases, StatusCodes } = require('http-status-codes');
const { withErrorHandling } = require('../error-handler');

exports.getMovies = withErrorHandling(async (req, res, next) => {
  const { title } = req.query;

  if (title) {
    const movies = await retrieveMovies({ title });
    res.json(movies);
  } else {
    const movies = await retrieveMovies();
    res.json(movies);
  }
});

exports.getMovieById = withErrorHandling(async (req, res, next) => {
  const { id } = req.params;
  const movie = await retrieveMovieByid(id);

  res.json(movie);
});

exports.createMovie = withErrorHandling(async (req, res, next) => {
  const movie = await createMovie(req.body);
  res.json(movie);
});

exports.updateMovie = withErrorHandling(async (req, res, next) => {
  const updatedMovie = await updateMovie(req.params.id, req.body);
  res.json(updatedMovie);
});
