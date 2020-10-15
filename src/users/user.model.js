const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const joi = require('joi');

const baseSchema = () => {
  return joi.object({
    firstname: joi.string().trim(),
    lastname: joi.string().trim(),
    username: joi.string().trim(),
    password: joi.string(),
  });
};

const User = {
  createSchema: (() => {
    const schema = baseSchema();
    return schema.fork(['username', 'password'], (field) => field.required());
  })(),

  updateSchema: baseSchema(),
};

exports.validateCreateUser = async (user) => {
  try {
    await User.createSchema.validateAsync(user);
  } catch (e) {
    throw {
      status: StatusCodes.BAD_REQUEST,
      message: `${ReasonPhrases.BAD_REQUEST}. ${e.message}`,
    };
  }
};

exports.validateUpdateUser = async (user) => {
  try {
    await User.updateSchema.validateAsync(user);
  } catch (e) {
    throw {
      status: StatusCodes.BAD_REQUEST,
      message: `${ReasonPhrases.BAD_REQUEST}. ${e.message}`,
    };
  }
};
