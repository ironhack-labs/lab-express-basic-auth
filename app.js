require('dotenv/config');
const express = require('express');
const logger = require('morgan');
const hbs = require('hbs');

const app = express();

// ℹ️ Connects to the database
require('./config/db.config');
app.use(logger('dev'));

app.set('views', `${__dirname}/views`);
app.set('view engine', 'hbs');
app.use(express.static(`${__dirname}/public`));
hbs.registerPartials(__dirname + "/views/partials");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const { sessionConfig, loadUser} = require('./config/session.config');
app.use(sessionConfig);
app.use(loadUser);

const routes = require('./config/routes.config');
const { load } = require('dotenv');
app.use('/', routes);


app.use((req, res, next) => res.status(404).render('errors/not-found'));

app.use((err, req, res, next) => {
  console.error('ERROR', req.method, req.path, err);
  if (!res.headersSent) {
    res.status(500).render('errors/internal');
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Ready! Listening on port ${port}`));





/* // ℹ️ This function is getting exported from the config folder. It runs most middlewares
require('./config')(app);

// default value for title local
const projectName = 'lab-express-basic-auth';
const capitalized = string => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`;


// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app); */

module.exports = app;

