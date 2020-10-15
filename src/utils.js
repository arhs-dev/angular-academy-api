exports.findOne = (collection, query) => {
  return collection.find((item) => {
    let isFound = true;
    for (const key in query) {
      if (!item[key] || query[key] !== item[key]) {
        isFound = false;
        break;
      }
    }
    return isFound;
  });
};
