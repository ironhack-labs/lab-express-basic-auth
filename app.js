require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// require database configuration
require('./configs/db.config');

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';


//express-session
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

app.use(
    session({
      secret: process.env.SESSION_SECRET,
      cookie: { maxAge: 1000 * 60 * 60 * 24 },
      // session is uninitialized when it is new but not modified 
      saveUninititalized: false,
      // always resave even if not modified
      resave: true,
      store: new MongoStore({
        mongooseConnection: mongoose.connection,
        // time to live - if the session cookie has an expiration date this is used - 
        // if not the ttl option is used 
        ttl: 24 * 60 * 60 * 1000
      })
    })
  )
  

// // passport configuration
// const session = require('express-session');
// const MongoStore = require('connect-mongo')(session);

// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     cookie: { maxAge: 24 * 60 * 60 * 1000 },
//     saveUninitialized: false,
//     resave: false,
//     store: new MongoStore({
//       mongooseConnection: mongoose.connection,
//       ttl: 24 * 60 * 60 * 1000
//     })
//   })
// );

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/User.model');
const bcrypt = require('bcrypt');

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


//social login for github 
const GithubStrategy = require('passport-github').Strategy;

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
            // user already exists
            console.log('github user found')
            done(null, found);
          } else {
            // no user with that github id
            console.log('new Github user')
            console.log(profile);
            return User.create({
              githubId: profile.id,
              name: profile._json.login,
              avatar: profile._json.avatar_url
            }).then(dbUser => {
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

//social login for google 

const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      console.log(profile)
      User.findOne({googleId: profile.id})
      .then( data => {
          if (data !== null) {
            console.log('google user found')
            done(null, data);
          } else {
              console.log('new google user')
              return User.create({
                  googleId: profile.id,
                  name: profile._json.name,
                  avatar: profile._json.picture
              })
              .then( data => {
                  done(null, data)
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

// // end of passport



//end of configuration
const index = require('./routes/index.routes');
app.use('/', index);

const auth = require('./routes/auth');
app.use('/', auth);



module.exports = app;
