// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv/config');

const session = require("express-session")
const MongoStore = require("connect-mongo")

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


// default value for title local
const projectName = 'lab-express-basic-auth';
const capitalized = string => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`;

app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 60000 // 60 * 1000 ms === 1 min
    },
    store: MongoStore.create({ mongoUrl: `mongodb+srv://${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}@cluster0.xifx6un.mongodb.net/?retryWrites=true&w=majority`}),
  })
);

// 👇 Here we link all the files from routes folder
const index = require('./routes/index');
app.use('/', index);

const authRouter = require('./routes/auth.routes');
app.use('/', authRouter);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);

module.exports = app;
