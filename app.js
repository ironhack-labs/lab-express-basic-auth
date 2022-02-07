require('dotenv/config');
require('./config/db.config');

const express = require('express');
const app = express();
const hbs = require('hbs');
const logger = require('morgan');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const { sessionConfig, loadUser } = require('./config/session.config')
app.use(sessionConfig)
app.use(loadUser)

app.set('views',`${__dirname}/views`);
app.set('view engine', 'hbs');
app.use(express.static((__dirname, '..', 'public')));

const routes = require('./config/routes.config');
app.use('/', routes);

// Connecting to server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});

module.exports = app;