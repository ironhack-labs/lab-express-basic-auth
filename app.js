require('dotenv').config();
const path = require('path');
const express = require('express');
const createError = require('http-errors');
const logger = require('morgan');
const favicon = require('serve-favicon');

const cookieParser = require('cookie-parser');
const hbs = require('hbs');
const mongoose = require('mongoose');

// we added
const session = require('express-session');

// we added
const MongoStore = require('connect-mongo')(session);

// Set up the database
require('./configs/db.config');

// Routers
const indexRouter = require('./routes/index.routes');

const app = express();

// we added
app.use(
  session({
    secret: 'doesnt-matter',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 * 60 }, // 1 hour
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 60 * 60 * 24 // 60sec * 60min * 24h => 1 day
    })
  })
);

// Express View engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

// Routes middleware
app.use('/', indexRouter);

// Catch missing routes and forward to error handler
app.use((req, res, next) => next(createError(404)));

// Catch all error handler
app.use((error, req, res) => {
  // Set error information, with stack only available in development
  res.locals.message = error.message;
  res.locals.error = req.app.get('env') === 'development' ? error : {};

  // render the error page
  res.status(error.status || 500);
  res.render('error');
});

module.exports = app;