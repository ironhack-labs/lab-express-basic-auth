'use strict';

// ---------- PACKAGES REQUIRED ----------
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');

// ---------- CONFIGURE THE ROUTES ----------
const index = require('./routes/index');
const quotes = require('./routes/quotes');
const auth = require('./routes/auth');

// ---------- CREATE THE APP ----------
const app = express();

// ---------- CONFIGURE THE VIEWS ----------
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// ---------- COOKIES AND SESSIONS ----------
app.use(session({
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 30 * 24 * 60 * 60 // 1 day
  }),
  secret: 'some-string',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000
  }
}));

// ---------- CONNECT THE DATABASE ----------
mongoose.connect('mongodb://127.0.0.1:27017/iron-dixit');

// ---------- MIDDLEWARES ----------
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);
app.use((req, res, next) => {
  app.locals.currentUser = req.session.user;
  console.log('USER SESSION', req.session.id);
  next();
});
app.use(flash());

// ---------- ROUTES ----------
app.use('/', index);
app.use('/quotes', quotes);
app.use('/auth', auth);

// ---------- 404 AND ERROR HANDLER ----------
app.use((req, res, next) => {
  res.status(404);
  res.render('pages/errors/404');
});

app.use((err, req, res, next) => {
  console.error('ERROR', req.method, req.path, err);
  if (!res.headersSent) {
    res.status(500);
    res.render('pages/errors/500');
  }
});

module.exports = app;
