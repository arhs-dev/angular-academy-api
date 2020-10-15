const { StatusCodes, ReasonPhrases } = require('http-status-codes');
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

exports.retrieveMovieByid = async (id) => {
  const moviesCollection = collection('movies');
  const movie = await moviesCollection.getOne({ id });

  if (!movie) {
    throw {
      status: StatusCodes.NOT_FOUND,
      message: ReasonPhrases.NOT_FOUND,
    };
  }

  return movie;
};

exports.createMovie = async (movie) => {
  await validateCreateMovie(movie);

  const moviesCollection = collection('movies');
  const movieWithId = {
    ...movie,
    id: nanoid(10),
  };

  return moviesCollection.create(movieWithId);
};

exports.updateMovie = async (id, movie) => {
  await validateUpdateMovie(movie);

  const moviesCollection = collection('movies');

  return moviesCollection.updateOne({ id }, movie);
};
