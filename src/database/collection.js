const fs = require('fs-extra');
const path = require('path');

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
      if (Object.keys(query).length) {
        for (const key in query) {
          data = data.filter((item) => {
            if (!item[key]) {
              return true;
            } else {
              const valueToInclude = query[key].toLowerCase();
              return item[key].toLowerCase().includes(valueToInclude);
            }
          });
        }
      }

      return data;
    },

    async getOne(query = {}) {
      let data = await openCollectionFile(collectionFile);
      return data.find((item) => {
        let isFound = true;
        for (const key in query) {
          if (!item[key] || query[key] !== item[key]) {
            isFound = false;
            break;
          }
        }
        return isFound;
      });
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
  };
};
