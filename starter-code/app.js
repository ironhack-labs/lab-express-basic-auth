require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const passport = require('passport');
// First example
const LocalStrategy = require('passport-local').Strategy;
// Second example
const SlackStrategy = require('passport-slack').Strategy;
const flash = require('connect-flash');
const app_name = require('./package.json').name;

const User = require('./models/user');


// Mongoose configuration
mongoose.Promise = Promise;
mongoose
  .connect('mongodb://localhost/basic-auth', { useNewUrlParser: true })
  .then((x) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
  })
  .catch((err) => {
    console.error('Error connecting to mongo', err);
  });

const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// app.js
app.use(session({
  secret: 'our-passport-local-strategy-app',
  resave: true,
  saveUninitialized: true,
}));

passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

app.use(flash());

// // The local strategy is triggered when the user tries to login
passport.use(new LocalStrategy((username, password, next) => {
  console.log('Hey Local', username)
  User.findOne({ username }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(null, false, { message: 'Incorrect username' });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return next(null, false, { message: 'Incorrect password' });
    }

    return next(null, user);
  });
}));

// SlackStrategy
passport.use(new SlackStrategy({
  clientID: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
}, (accessToken, refreshToken, profile, done) => {
  console.log('DEBUG profile', profile);
  User.findOne({ slackID: profile.id })
    .then((user) => {
      if (user) {

        return done(null, user);
      }
      
      const newUser = new User({
        slackID: profile.id,
      });

      newUser.save()
        .then((user) => {
          done(null, newUser);
        });
    })
    .catch((error) => {
      console.log(error);
      done(error);
    });
}));

// app.js
app.use(passport.initialize());
app.use(passport.session());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true,
}));


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));


// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';




const auth = require('./routes/auth');
app.use('/', auth);
const site = require('./routes/site');
app.use('/', site);




module.exports = app;
