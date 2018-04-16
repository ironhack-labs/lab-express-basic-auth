'use strict'

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts');
const logger = require('morgan');
const mongoose = require('mongoose');

// ---------- Configure the views ----------
const index = require('./routes/index');
const users = require('./routes/users');


// ---------- Start the APP ----------
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// ---------- Connect the database ----------
mongoose.connect('mongodb://127.0.0.1:27017/express-basic-auth');

// ---------- Middlewares ----------
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ---------- Routes ----------
app.use('/', index);
app.use('/users', users);



// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
