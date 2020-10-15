const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const joi = require('joi');

const Movie = joi.object({
  title: joi.string().trim().required(),
  description: joi.string().trim(),
});

exports.validateMovie = async (movie) => {
  try {
    await Movie.validateAsync(movie);
  } catch (e) {
    throw {
      status: StatusCodes.BAD_REQUEST,
      message: `${ReasonPhrases.BAD_REQUEST}. ${e.message}`,
    };
  }
};
