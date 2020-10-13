const fs = require('fs');

const movies = [
  { id: '1', title: 'Avengers1' },
  { id: '2', title: 'Avengers2' },
  { id: '3', title: 'Avengers3' },
];

fs.writeFile('db.mock.json', JSON.stringify(movies), (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('done');
  }
});
