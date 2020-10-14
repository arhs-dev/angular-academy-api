const { retrieveMovies, retrieveMovieByid, createMovie } = require('./movies.service');
const { ReasonPhrases, StatusCodes, getReasonPhrase, getStatusCode } = require('http-status-codes');

exports.getMovies = async (req, res, next) => {
  const { title } = req.query;

  if (title) {
    const movies = await retrieveMovies({ title });
    res.json(movies);
  } else {
    const movies = await retrieveMovies();
    res.json(movies);
  }
};

exports.getMovieById = async (req, res, next) => {
  const { id } = req.params;
  const movie = await retrieveMovieByid(id);
  if (!movie) {
    throw {
      status: StatusCodes.NOT_FOUND,
      message: ReasonPhrases.NOT_FOUND,
    };
  }
  res.json(movie);
};

exports.createMovie = async (req, res, next) => {
  const movie = await createMovie(req.body);
  res.json(movie);
};
