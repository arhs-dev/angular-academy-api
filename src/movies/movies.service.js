const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const { nanoid } = require('nanoid');
const { collection } = require('../database/collection');
const { validateCreateMovie, validateUpdateMovie } = require('./movie.model');

exports.retrieveMovies = (query) => {
  const moviesCollection = collection('movies');

  if (query) {
    return moviesCollection.get({ $includes: query });
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

  const exists = await moviesCollection.getOne({ title: movie.title });

  if (exists) {
    throw {
      status: StatusCodes.CONFLICT,
      message: `${ReasonPhrases.CONFLICT} title exists`,
    };
  }

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

exports.deleteMovie = async (id) => {
  const moviesCollection = collection('movies');
  const favoriteMoviesCollection = collection('favorite-movies');

  await favoriteMoviesCollection.removeMultiple({ $exact: { movieId: id } });
  return moviesCollection.remove(id);
};
