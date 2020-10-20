const path = require('path');
const fs = require('fs-extra');
const collectionsPath = path.resolve('./', `db`);

exports.collections = [
  { id: 'users', _uniques: ['id', 'username'] },
  { id: 'movies', _uniques: ['id', 'title'] },
  { id: 'favorite-movies', _uniques: ['id'] },
];

exports.ensureCollections = () => {
  fs.ensureDirSync(collectionsPath);

  this.collections.forEach(({ id: collection }) => {
    const collectionPath = collectionsPath + `/${collection}.json`;
    if (!fs.existsSync(collectionPath)) {
      fs.writeFileSync(collectionPath, JSON.stringify([]));
    } else {
      const content = fs.readFileSync(collectionPath);
      try {
        JSON.parse(content);
      } catch (e) {
        fs.writeFileSync(collectionPath, JSON.stringify([]));
      }
    }
  });
};
