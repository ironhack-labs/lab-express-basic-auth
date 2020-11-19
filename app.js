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
const MongoStore = require('connect-mongo')(session);
const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('./models/User.model');
const GithubStrategy = require('passport-github').Strategy
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


const app_name = require('./package.json').name;
const debug = require('debug')(
  `${app_name}:${path.basename(__filename).split('.')[0]}`
);

const app = express();

// require database configuration
require('./configs/db.config');

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
// maybe an issue here and change to false if so?
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    saveUninititalized: false,
    resave: true,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60 * 1000,
    }),
  })
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(dbUser => {
      done(null, dbUser);
    })
    .catch(err => {
      done(err);
    });
});

// if you want to do the regular user/login with password
passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username })
      .then(found => {
        if (found === null) {
          done(null, false, { message: 'Wrong credentials' });
        } else if (!bcrypt.compareSync(password, found.password)) {
          done(null, false, { message: 'Wrong credentials' });
        } else {
          done(null, found);
        }
      })
      .catch(err => {
        done(err, false);
      });
  })
);

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      callbackURL: 'http://127.0.0.1:3000/github/callback'
    },
    (accessToken, refreshToken, profile, done) => {
      // find a user with profile.id as githubId or create one
      console.log(profile);
      User.findOne({ githubId: profile.id })
        .then(found => {
          if (found !== null) {
            done(null, found);
          } else {
            return User.create({ username: profile.username , githubId: profile.id}).then(dbUser => {
              done(null, dbUser);
            })
          }
        })
        .catch(error => {
          done(error);
        })
    }
  )
)

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://127.0.0.1:3000/google/callback",
  scope: "https://www.googleapis.com/auth/userinfo.profile"
},
function(accessToken, refreshToken, profile, done) {
  console.log(profile);
  User.findOne({ googleId: profile.id })
  .then(found => {
    if (found !== null) {
      done(null, found);
    } else {
      return User.create({ username: profile.displayName , githubId: profile.id}).then(dbUser => {
        done(null, dbUser);
      })
    }
  })
  .catch(error => {
    done(error);
  })
}
));

app.use(passport.initialize());
app.use(passport.session());

const index = require('./routes/index.routes');
app.use('/', index);

const auth = require('./routes/auth.routes');
// const { MongoStore } = require('connect-mongo');
app.use('/', auth);

module.exports = app;
