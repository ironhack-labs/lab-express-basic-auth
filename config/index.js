// We reuse this import in order to have access to the `body` property in requests
const express = require('express');

// ℹ️ Responsible for the messages you see in the terminal as requests are coming in
// https://www.npmjs.com/package/morgan
const logger = require('morgan');

// ℹ️ Needed when we deal with cookies (we will when dealing with authentication)
// https://www.npmjs.com/package/cookie-parser
const cookieParser = require('cookie-parser');

// ℹ️ Serves a custom favicon on each request
// https://www.npmjs.com/package/serve-favicon
const favicon = require('serve-favicon');

// ℹ️ global package used to `normalize` paths amongst different operating systems
// https://www.npmjs.com/package/path
const path = require('path');

const session = require('express-session');

const MongoStore = require('connect-mongo');

// Middleware configuration
module.exports = (app) => {
  // In development environment the app logs
  app.use(logger('dev'));

  // To have access to `body` property in the request
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  // Normalizes the path to the views folder
  app.set('views', path.join(__dirname, '..', 'views'));
  // Sets the view engine to handlebars
  app.set('view engine', 'hbs');
  // Handles access to the public folder
  app.use(express.static(path.join(__dirname, '..', 'public')));

  // Handles access to the favicon
  app.use(
    favicon(path.join(__dirname, '..', 'public', 'images', 'favicon.ico'))
  );

  const MONGO_URI =
    process.env.MONGODB_URI || 'mongodb://localhost/lab-express-basic-auth';

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: true,
      saveUninitialized: false,
      store: MongoStore.create({ mongoUrl: MONGO_URI }),
    })
  );
};

// app.use((req, res, next) => {
//   if (req.session.currentUser) {
//     User.findId(req.session.currentUser._id)
//       .then((userFromDb) => {
//         res.locals.currentUser = userFromDb;
//         res.locals.isLoggedIn = true;
//         next();
//       })
//       .catch((err) => {
//         next(err);
//       });
//   } else {
//     res.locals.currentUser = undefined;
//     res.locals.isLoggedIn = false;
//     next();
//   }
// });

// app.use((req, res, next) => {
//   console.log(req.session);
//   next();
// });
