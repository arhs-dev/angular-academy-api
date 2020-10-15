const Joi = require('joi');
const { nanoid } = require('nanoid');
const { collection } = require('../database/collection');
const { Movie, validateCreateMovie, validateUpdateMovie } = require('./movie.model');

exports.retrieveMovies = (query) => {
  const moviesCollection = collection('movies');

  if (query) {
    return moviesCollection.get(query);
  } else {
    return moviesCollection.get();
  }
};

exports.retrieveMovieByid = (id) => {
  const moviesCollection = collection('movies');

  return moviesCollection.getOne({ id });
};

exports.createMovie = async (movie) => {
  await validateCreateMovie(movie);

  const moviesCollection = collection('movies');
  const movieWithId = {
    ...movie,
    id: nanoid(10),
  };

  const movieInDb = moviesCollection.create(movieWithId);

  return movieInDb;
};

exports.updateMovie = async (id, movie) => {
  await validateUpdateMovie(movie);

  const moviesCollection = collection('movies');

  return await moviesCollection.updateOne({ id }, movie);
};
