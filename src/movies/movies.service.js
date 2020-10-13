const fs = require('fs');
const { resolve } = require('path');
const { dbUrl } = require('../config.js');

exports.retrieveMovies = (query) => {
  return new Promise((resolve, reject) => {
    fs.readFile(dbUrl, (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      let movies = JSON.parse(data);

      if (query) {
        movies = movies.filter(({ title }) => title.toLowerCase().includes(query.toLowerCase()));
      }

      resolve(movies);
    });
  });
};

exports.retrieveMovie = (idOrTitle) => {
  return new Promise((resolve, reject) => {
    fs.readFile(dbUrl, (err, data) => {
      if (err) reject(err);
      else {
        const movies = JSON.parse(data);
        const movie = movies.find(({ id, title }) => idOrTitle === id || idOrTitle === title);
        resolve(movie);
      }
    });
  });
};

exports.createMovie = (movie) => {
  return new Promise(async (resolve) => {
    const data = fs.readFileSync(dbUrl);

    const movies = JSON.parse(data);

    const movieWithId = {
      ...movie,
      id: (movies.length + 1).toString(),
    };

    movies.push(movieWithId);

    fs.writeFile(dbUrl, JSON.stringify(movies), (err) => {
      if (err) reject(err);
      else resolve(movieWithId);
    });
  });
};
