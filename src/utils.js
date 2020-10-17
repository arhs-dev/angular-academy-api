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

exports.exactMatch = (item, query) => {
  for (const key in query) {
    if (!item[key] || item[key] !== query[key]) {
      return false;
    }
  }

  return true;
};

exports.includesMatch = (item, query) => {
  for (const key in query) {
    if (!item[key]) {
      return true;
    } else {
      const valueToInclude = query[key].toLowerCase();
      return item[key].toLowerCase().includes(valueToInclude);
    }
  }
};
