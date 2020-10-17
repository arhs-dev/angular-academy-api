const fs = require('fs-extra');
const path = require('path');
const { findOne, exactMatch, includesMatch } = require('../utils');
const cloneDeep = require('clone-deep');
const { StatusCodes, ReasonPhrases } = require('http-status-codes');

const openCollectionFile = (collectionFile) => {
  return new Promise((resolve, reject) => {
    fs.readFile(collectionFile, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
};

exports.collection = (collectionName) => {
  const collectionFile = path.resolve('./', `db/${collectionName}.json`);

  return {
    async get(query = {}) {
      let data = await openCollectionFile(collectionFile);

      if (query.$exact) {
        data = data.filter((item) => exactMatch(item, query.$exact));
      }

      if (query.$includes) {
        data = data.filter((item) => includesMatch(item, query.$includes));
      }

      return data;
    },

    async getOne(query = {}) {
      let data = await openCollectionFile(collectionFile);
      return findOne(data, query);
    },

    async create(item) {
      let data = await openCollectionFile(collectionFile);
      data.push(item);

      return new Promise((resolve, reject) => {
        fs.writeFile(collectionFile, JSON.stringify(data), (err) => {
          if (err) {
            reject(err);
          } else resolve(item);
        });
      });
    },

    async updateOne(filter, updatedItem) {
      const data = await openCollectionFile(collectionFile);
      const itemToChange = findOne(data, filter);

      if (!itemToChange) {
        throw {
          status: StatusCodes.NOT_FOUND,
          message: ReasonPhrases.NOT_FOUND,
        };
      }

      for (const key in updatedItem) {
        itemToChange[key] = cloneDeep(updatedItem[key]);
      }

      return new Promise((resolve, reject) => {
        // data has been updated by mutation
        fs.writeFile(collectionFile, JSON.stringify(data), (err) => {
          if (err) {
            reject(err);
          } else resolve(itemToChange);
        });
      });
    },

    async remove(id) {
      const data = await openCollectionFile(collectionFile);
      const isFound = findOne(data, { id });

      if (!isFound) {
        throw {
          status: StatusCodes.NOT_FOUND,
          message: ReasonPhrases.NOT_FOUND,
        };
      }

      const updatedData = data.filter((item) => item.id !== id);

      return new Promise((resolve, reject) => {
        fs.writeFile(collectionFile, JSON.stringify(updatedData), (err) => {
          if (err) {
            reject(err);
          } else resolve(id);
        });
      });
    },

    async removeMultiple(query) {
      let data = await openCollectionFile(collectionFile);

      if (query.$exact) {
        data = data.filter((item) => !exactMatch(item, query.$exact));
      }

      if (query.$includes) {
        data = data.filter((item) => !includesMatch(item, query.$includes));
      }

      return new Promise((resolve, reject) => {
        fs.writeFile(collectionFile, JSON.stringify(data), (err) => {
          if (err) {
            reject(err);
          } else resolve('ok');
        });
      });
    },
  };
};
