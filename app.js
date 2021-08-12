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

// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require('./config')(app);
// require session
const session = require('express-session');

// ADDED: require mongostore
const MongoStore = require('connect-mongo');

const mongoose = require('mongoose');

app.use(
  session({
    secret: 'doesnt matter',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 600000 }, // 10 minutes
    store: MongoStore.create({
      mongoUrl: "mongodb://localhost/lab-express-basic-auth",
      //mongooseConnection: mongoose.connection,
      // ttl => time to live
      // ttl: 60 * 60 * 24 // 60sec * 60min * 24h => 1 day
    })
  })
);


// default value for title local
const projectName = 'lab-express-basic-auth';
const capitalized = string => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`;

// 👇 Start handling routes here
const index = require('./routes/index');
app.use('/', index);

const authRouter = require('./routes/auth.routes');
app.use('/', authRouter);


// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);

module.exports = app;

