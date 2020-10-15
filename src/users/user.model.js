const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const joi = require('joi');

const User = joi.object({
  firstname: joi.string().trim(),
  lastname: joi.string().trim(),
  username: joi.string().trim().required(),
  password: joi.string().required(),
});

exports.validateUser = async (user) => {
  try {
    await User.validateAsync(user);
  } catch (e) {
    throw {
      status: StatusCodes.BAD_REQUEST,
      message: `${ReasonPhrases.BAD_REQUEST}. ${e.message}`,
    };
  }
};
