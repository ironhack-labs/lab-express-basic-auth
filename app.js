'use strict';

const { join } = require('path');
const express = require('express');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const serveFavicon = require('serve-favicon');
const mongoose = require('mongoose');


const expressSession = require("express-session");
const MongoStore = require("connect-mongo")(expressSession);

const indexRouter = require('./routes/index');
const authenticationRouter = require('./routes/authentication');
const app = express();

// Setup view engine
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(serveFavicon(join(__dirname, 'public/images', 'favicon.ico')));
app.use(express.static(join(__dirname, 'public')));
app.use(sassMiddleware({
  src: join(__dirname, 'public'),
  dest: join(__dirname, 'public'),
  outputStyle: process.env.NODE_ENV === 'development' ? 'nested' : 'compressed',
  sourceMap: true
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(expressSession({
  secret: process.env.SECRET_SESSION,
  cookie: { maxAge: 60 * 60 * 24 * 1000},
  resave: true,
  saveUnitialized: false,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
  ttl: 24 * 60 * 60
  })
}));

app.use('/', indexRouter);
app.use('/', authenticationRouter);


// Catch missing routes and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Catch all error handler
app.use((error, req, res, next) => {
  // Set error information, with stack only available in development
  res.locals.message = error.message;
  res.locals.error = req.app.get('env') === 'development' ? error : {};

  res.status(error.status || 500);
  res.render('error');
});

module.exports = app;
