// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv/config');

// ℹ️ Connects to the database
// require('./db');
const { MONGO_URI } = require('./db');
// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require('hbs');

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require('./config')(app);

app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 600000,
    },
    store: MongoStore.create({
      mongoUrl: MONGO_URI,
    }),
  })
);

app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});

// default value for title local
const projectName = 'lab-express-basic-auth';
const capitalized = (string) =>
  string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`;

// 👇 Start handling routes here
const index = require('./routes/index.routes');
const auth = require('./routes/users/auth.routes');
const users = require('./routes/users/user.routes');
app.use('/', index);
app.use('/user', auth);
app.use('/user', users);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);

module.exports = app;
