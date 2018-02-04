const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const index = require('./routes/index');
const authRoutes = require('./routes/auth-routes');

// Controllers

// Mongoose configuration
mongoose.connect('mongodb://localhost/basic-auth');

// Middlewares configuration
app.use(logger('dev'));

// View engine configuration
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// Access POST params with body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Authentication
app.use(cookieParser());

// Routes
app.use('/', index);
app.use('/', authRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(404);
  res.render('not-found');
});

// NOTE: requires a views/error.ejs template
app.use(function (err, req, res, next) {
  // always log the error
  console.error('ERROR', req.method, req.path, err);

  // only render if the error ocurred before sending the response
  if (!res.headersSent) {
    res.status(500);
    res.render('error');
  }
});

module.exports = app;
