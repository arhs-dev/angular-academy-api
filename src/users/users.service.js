const { nanoid } = require('nanoid');
const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const { collection } = require('../database/collection');
const { validateCreateUser, validateUpdateUser } = require('./user.model');
const cloneDeep = require('clone-deep');

exports.getUserById = async (id) => {
  const usersCollection = collection('users');

  const user = await usersCollection.getOne({ id });
  if (!user) {
    throw {
      status: StatusCodes.NOT_FOUND,
      message: `${ReasonPhrases.NOT_FOUND}. Most probably the account was deleted`,
    };
  }

  delete user.password;
  return user;
};

exports.signupUser = async (user) => {
  await validateCreateUser(user);

  const usersCollection = collection('users');

  user.id = nanoid(10);
  const userInDb = await usersCollection.create(user);
  delete userInDb.password;

  return userInDb;
};

exports.signinUser = async (user) => {
  const usersCollection = collection('users');

  const userInDb = await usersCollection.getOne({ username: user.username });
  if (!userInDb || userInDb.password !== user.password) {
    throw {
      status: StatusCodes.BAD_REQUEST,
      message: ReasonPhrases.BAD_REQUEST,
    };
  }

  delete userInDb.password;
  return userInDb;
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

exports.deleteUserById = async (userId) => {
  const usersCollection = collection('users');

  const favoriteMoviesCollection = collection('favorite-movies');
  await favoriteMoviesCollection.removeMultiple({ $exact: { userId } });

  return usersCollection.remove(userId);
};

exports.createUserFavorite = async (userId, movieId) => {
  const favoriteMoviesCollection = collection('favorite-movies');
  const usersCollection = collection('users');
  const moviesCollection = collection('movies');

  const userExists = await usersCollection.getOne({ id: userId });
  const movieExists = await moviesCollection.getOne({ id: movieId });

  if (!userExists) {
    throw {
      status: StatusCodes.NOT_FOUND,
      message: `${ReasonPhrases.NOT_FOUND} user not found`,
    };
  }

  if (!movieExists) {
    throw {
      status: StatusCodes.NOT_FOUND,
      message: `${ReasonPhrases.NOT_FOUND} movie not found`,
    };
  }

  const favoriteExists = await favoriteMoviesCollection.getOne({ userId, movieId });

  if (favoriteExists) {
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
