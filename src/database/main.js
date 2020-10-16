const path = require('path');
const fs = require('fs-extra');
const collectionsPath = path.resolve('./', `db`);

const collections = ['users', 'movies', 'favorite-movies'];

exports.ensureCollections = () => {
  fs.ensureDir(collectionsPath);

  collections.forEach((collection) => {
    const collectionPath = collectionsPath + `/${collection}.json`;
    if (!fs.existsSync(collectionPath)) {
      fs.writeFile(collectionPath, JSON.stringify([]));
    } else {
      const content = fs.readFileSync(collectionPath);
      try {
        JSON.parse(content);
      } catch (e) {
        fs.writeFile(collectionPath, JSON.stringify([]));
      }
    }
  });
};
