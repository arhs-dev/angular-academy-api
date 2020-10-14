const { nanoid } = require('nanoid');
const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const { collection } = require('../database/collection');

exports.signupUser = async (user) => {
  const dbCollection = collection('users');

  user.id = nanoid(10);
  const userInDb = await dbCollection.create(user);

  return userInDb;
};

exports.signinUser = async (user) => {
  const dbCollection = collection('users');

  const userInDb = await dbCollection.getOne({ username: user.username });
  if (!userInDb) {
    throw {
      status: StatusCodes.NOT_FOUND,
      message: StatusCodes.NOT_FOUND,
    };
  }
  if (userInDb.password === user.password) {
    return userInDb;
  } else {
    throw {
      status: StatusCodes.UNAUTHORIZED,
      message: StatusCodes.UNAUTHORIZED,
    };
  }
};
