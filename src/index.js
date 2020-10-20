const express = require('express');
const http = require('http');
const morgan = require('morgan');
const { port } = require('./config');
const { moviesRouter } = require('./movies/movies.router');
const bodyParser = require('body-parser');
const { usersRouter } = require('./users/users.router');
const { ensureCollections } = require('./database/main');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

ensureCollections();

const app = express();
app.use(cors());
app.use(morgan('dev'));

const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(bodyParser.json());

app.use('/movies', moviesRouter);
app.use('/users', usersRouter);
app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status).send({ message: err.message });
});

const server = http.createServer(app);

server.listen(port, () =>
  console.log(`
  Angular academy API listening on http://localhost:${port}
  Docs at http://localhost:${port}/api-docs  
`),
);
