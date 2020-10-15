const { nanoid } = require('nanoid');
const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const { collection } = require('../database/collection');
const { validateCreateUser, validateUpdateUser } = require('./user.model');

exports.signupUser = async (user) => {
  await validateCreateUser(user);

  const dbCollection = collection('users');

  user.id = nanoid(10);
  const userInDb = await dbCollection.create(user);
  delete userInDb.password;

  return userInDb;
};

exports.signinUser = async (user) => {
  const dbCollection = collection('users');

  const userInDb = await dbCollection.getOne({ username: user.username });
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
  return await usersCollection.updateOne({ id }, user);
};
