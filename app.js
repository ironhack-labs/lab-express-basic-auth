// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv/config');

// ℹ️ Connects to the database
require('./db');

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require('express');

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require('hbs');

const logger = require('morgan');
const favicon = require('serve-favicon');

const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const { sessionConfig, currentUser } = require('./configs/session.config');

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require('./configs')(app);

// app.use(express.static(path.join(__dirname, 'public')));
// app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// default value for title local
const projectName = 'lab-express-basic-auth';
const capitalized = string => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`;

// Session middleware
app.use(sessionConfig);
app.use(currentUser);

// 👇 Start handling routes here
const indexRouter = require('./routes/index');

app.use('/', indexRouter);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
// require('./error-handling')(app);

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

