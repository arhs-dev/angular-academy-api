const { nanoid } = require('nanoid');
const { collection } = require('../database/collection');

exports.retrieveMovies = (query) => {
  const dbCollection = collection('movies');

  if (query) {
    return dbCollection.get(query);
  } else {
    return dbCollection.get();
  }
};

exports.retrieveMovieByid = (id) => {
  const dbCollection = collection('movies');

  return dbCollection.getOne({ id });
};

exports.createMovie = async (movie) => {
  const dbCollection = collection('movies');
  const movieWithId = {
    ...movie,
    id: nanoid(10),
  };

  const movieInDb = dbCollection.create(movieWithId);

  return movieInDb;
};
