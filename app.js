const express = require('express');
const logger = require('morgan');
const cookieParser = require("cookie-parser");
const favicon = require("serve-favicon");
const path = require("path");
const createError = require('http-errors');
const {sessionConfig, loggedUser } = require ("./config/session.config");

require('dotenv/config');

const router = require('./config/routes.config');
require('./config/db.config');
require('./config/hbs.config');

const app = express();

app.use(logger('dev')); // logger de morgan para ver las peticiones que se hacen
app.use(express.json()); // para que el body de las peticiones se pueda leer y ver en terminal
app.use(express.urlencoded({ extended: false })); // para que el body de las peticiones se pueda leer

app.use(cookieParser());

app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

/** Configure static files */
app.use(express.static(path.join(__dirname, ".", "public")));
app.use(favicon(path.join(__dirname, ".", "public", "images", "favicon.ico")));

//session middleware
app.use(sessionConfig);
app.use(loggedUser);

/** Router **/
app.use('/', router)

/**
 * Error Middlewares
 */

app.use((req, res, next) => {
  next(createError(404, 'Page not found'));
});

app.use((error, req, res, next) => {
  console.log(error)
  let status =  error.status || 500;

  res.status(status).render('error', {
    message: error.message,
    error: req.app.get('env') === 'development' ? error : {}
  })
})

module.exports = app;

