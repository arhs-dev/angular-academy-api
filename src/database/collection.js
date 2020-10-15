const fs = require('fs-extra');
const path = require('path');
const { findOne } = require('../utils');
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
        for (const key in query.$exact) {
          data = data.filter((item) => {
            return item[key] && item[key] === query.$exact[key];
          });
        }
      }

      if (query.$includes) {
        for (const key in query.$includes) {
          data = data.filter((item) => {
            if (!item[key]) {
              return true;
            } else {
              const valueToInclude = query.$includes[key].toLowerCase();
              return item[key].toLowerCase().includes(valueToInclude);
            }
          });
        }
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

      const updatedData = data.filter((item) => item.id !== id);

      return new Promise((resolve, reject) => {
        fs.writeFile(collectionFile, JSON.stringify(updatedData), (err) => {
          if (err) {
            reject(err);
          } else resolve(id);
        });
      });
    },
  };
};
