require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const app_name = require('./package.json').name;
const debug = require('debug')(
  `${app_name}:${path.basename(__filename).split('.')[0]}`
);

const User = require('./models/User.model.js');
const app = express();
require('./configs/session.config')(app);

passport.serializeUser((user, cb) => cb(null, user._id));

passport.deserializeUser((id, cb) => {
  User.findById(id)
    .then((user) => cb(null, user))
    .catch((err) => cb(err));
});

passport.use(
  new LocalStrategy(
    {
      usernameField: 'username', // by default
      passwordField: 'password', // by default
    },
    (username, password, done) => {
      User.findOne({
        username,
      })
        .then((user) => {
          if (!user) {
            return done(null, false, {
              message: 'Incorrect username',
            });
          }

          if (!bcrypt.compareSync(password, user.passwordHash)) {
            return done(null, false, {
              message: 'Incorrect password',
            });
          }

          done(null, user);
        })
        .catch((err) => done(err));
    }
  )
);

app.use(passport.initialize());
app.use(passport.session());

// require database configuration
require('./configs/db.config');

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(cookieParser());

// Express View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// default value for title local
app.locals.title = 'Basic Auth';

const index = require('./routes/index.routes');
app.use('/', index);

const user = require('./routes/user.routes');
app.use('/', user);

module.exports = app;
