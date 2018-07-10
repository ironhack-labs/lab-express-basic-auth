'use strict';

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
// const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

// Routes
const authRoutes = require('./routes/auth-routes');
const siteRoutes = require('./routes/site-routes');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/dbbasicauth', {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'basic-auth-secret',
  cookie: { maxAge: 60000 },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  })
}));

app.use(function (req, res, next) {
  app.locals.user = req.session.currentUser;
  next();
});

app.use('/', authRoutes);
app.use('/', siteRoutes);

// -- 404 and error handler

// NOTE: requires a views/not-found.ejs template
app.use((req, res, next) => {
  res.status(404);
  res.render('not-found');
});

// NOTE: requires a views/error.ejs template
app.use((err, req, res, next) => {
  // always log the error
  console.error('ERROR', req.method, req.path, err);

  // only render if the error ocurred before sending the response
  if (!res.headersSent) {
    res.status(500);
    res.render('error');
  }
});

module.exports = app;
