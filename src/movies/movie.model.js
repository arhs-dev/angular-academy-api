const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const joi = require('joi');

const baseSchema = () => {
  return joi.object({
    title: joi.string().trim(),
    description: joi.string().trim(),
  });
};

const Movie = {
  createSchema: (() => {
    const schema = baseSchema();
    return schema.fork(['title'], (field) => field.required());
  })(),

  updateSchema: baseSchema(),
};

exports.validateCreateMovie = async (movie) => {
  try {
    await Movie.createSchema.validateAsync(movie);
  } catch (e) {
    throw {
      status: StatusCodes.BAD_REQUEST,
      message: `${ReasonPhrases.BAD_REQUEST}. ${e.message}`,
    };
  }
};

exports.validateUpdateMovie = async (movie) => {
  try {
    await Movie.updateSchema.validateAsync(movie);
  } catch (e) {
    throw {
      status: StatusCodes.BAD_REQUEST,
      message: `${ReasonPhrases.BAD_REQUEST}. ${e.message}`,
    };
  }
};
