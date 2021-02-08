require('dotenv').config();

const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const process = require('process');
const routes = require('./configs/routes');
const createError = require("http-errors");
const session = require('./configs/session.config');
const User = require('./models/user.model')

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// require database configuration
require('./configs/db.config');

// Middleware Setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session);

// app.use((req, res, next) => {
//     next(createError(404));
//   });

// Express View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
hbs.registerPartials(__dirname + "/views/partials");

// Session
app.use((req, res, next) => {
    if (req.session.currentUserId) {
      User.findById(req.session.currentUserId)
        .then(user => {
          if (user) {
            req.currentUser = user
            res.locals.currentUser = user
  
            next()
          }
        })
    } else {
      next()
    }
  })

//Routes
app.use('/', routes);

// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

module.exports = app;
