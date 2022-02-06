const hbs = require('hbs');
const logger = require('morgan');
const express = require('express');
require('dotenv/config');

const app = express();

// ℹ️ Connects to the database
require('./config/db.config');

app.use(logger('dev'));

//Vistas
app.set('views', `${__dirname}/views`);
app.set('view engine', 'hbs');
app.use(express.static(`${__dirname}/public`));
hbs.registerPartials(__dirname + "/views/partials");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const { sessionConfig, loadUser } = require('./config/session.config')
app.use(sessionConfig)
app.use(loadUser)

// 👇 Start handling routes here
const routes = require('./config/routes.config');
app.use('/', routes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
app.use((req, res, next) => res.status(404).render('errors/not-found'));

app.use((err, req, res, next) => {
  console.error('ERROR', req.method, req.path, err);
  if (!res.headersSent) {
    res.status(500).render('errors/internal');
  }
});

// ℹ️ Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});