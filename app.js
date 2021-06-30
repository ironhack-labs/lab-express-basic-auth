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

const app = express();

const session = require("express-session");
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    cookie: {
      sameSite: true, //frontend and backend both run on localhost
      httpOnly: true, //we are not using https
      maxAge: 60000, //session time
    },
    rolling: true,
  })
)

function getCurrentLoggedUser(req, res, next) {
  if (req.session && req.session.banana) {
    app.locals.loggedInUser = req.session.banana.username;
  }else{
    app.locals.loggedInUser = "";
  }
  next();
}

app.use(getCurrentLoggedUser);

// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require('./config')(app);

// default value for title local
const projectName = 'lab-express-basic-auth';
const capitalized = string => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`;

// 👇 Start handling routes here
const index = require('./routes/index');
app.use('/', index);

const auth = require('./routes/auth');
app.use('/', auth);

const main = require('./routes/main');
app.use('/', main);

const private = require('./routes/private');
app.use('/', private);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);

module.exports = app;

