const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');

require('./config/db.config');

const authRouter = require('./routes/auth.router');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  name: 'user',
  secret: process.env.COOKIE_SECRET || 'SuperSecret',
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE || false,
    expires: 60 * 60 * 24 * 1000 * 7
  },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 60 * 60 * 24 * 1000 * 7
  })
}));

app.use('/', authRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
