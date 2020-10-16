const { nanoid } = require('nanoid');
const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const { collection } = require('../database/collection');
const { validateCreateUser, validateUpdateUser } = require('./user.model');
const cloneDeep = require('clone-deep');

exports.signupUser = async (user) => {
  await validateCreateUser(user);

  const usersCollection = collection('users');

  const exists = await usersCollection.getOne({ username: user.username });

  if (exists) {
    throw {
      status: StatusCodes.CONFLICT,
      message: `${ReasonPhrases.CONFLICT} username exists`,
    };
  }

  user.id = nanoid(10);
  const userInDb = await usersCollection.create(user);
  delete userInDb.password;

  return userInDb;
};

exports.signinUser = async (user) => {
  const usersCollection = collection('users');

  const userInDb = await usersCollection.getOne({ username: user.username });
  if (!userInDb) {
    throw {
      status: StatusCodes.NOT_FOUND,
      message: ReasonPhrases.NOT_FOUND,
    };
  }
  if (userInDb.password === user.password) {
    delete userInDb.password;
    return userInDb;
  } else {
    throw {
      status: StatusCodes.UNAUTHORIZED,
      message: ReasonPhrases.UNAUTHORIZED,
    };
  }
};

exports.updateUser = async (id, user) => {
  await validateUpdateUser(user);

  const usersCollection = collection('users');
  const updated = await usersCollection.updateOne({ id }, user);

  delete updated.password;

  return updated;
};

exports.getUserFavorites = async (userId) => {
  const favoritesCollection = collection('favorite-movies');
  const favoritesRef = await favoritesCollection.get({ $exact: { userId } });
  const moviesCollection = collection('movies');
  const movies = await moviesCollection.get();

  return favoritesRef.map((ref) => {
    const movie = movies.find((movie) => movie.id === ref.movieId);
    return {
      ...cloneDeep(movie),
      favoriteId: ref.id,
    };
  });
};

exports.createUserFavorite = async (userId, movieId) => {
  const favoriteMoviesCollection = collection('favorite-movies');

  const exists = await favoriteMoviesCollection.getOne({ userId, movieId });

  if (exists) {
    throw {
      status: StatusCodes.CONFLICT,
      message: `${ReasonPhrases.CONFLICT} already in favorites`,
    };
  }

  const favoriteMovie = {
    userId,
    movieId,
    id: nanoid(10),
  };

  return favoriteMoviesCollection.create(favoriteMovie);
};

exports.removeUserFavorite = async (favoriteMovieId) => {
  const favoriteMoviesCollection = collection('favorite-movies');
  return favoriteMoviesCollection.remove(favoriteMovieId);
};
