// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv/config');

// ℹ️ Connects to the database
require('./db');

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require('hbs');

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require('./config')(app);

const session = require("express-session");
const MongoStore = require("connect-mongo");

// default value for title local
const projectName = 'lab-express-basic-auth';
const capitalized = string => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`;

// MIDDLEWARE
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));


// SESSION MIDDLEWARE
// Checks incoming request: if there is a cookie, and if cookie has valid session id
app.use(
  session({
    secret: 'DannyBytes',
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000
    },
    store: MongoStore.create({
      mongoUrl: 'mongodb://localhost/auth-demo'
    })
  })
);

// 👇 Start handling routes here
const index = require('./routes/index');
app.use('/', index);

const authRouter = require('./routes/auth.router');
app.use('/auth', authRouter);

const protectedRouter = require('./routes/protected.router');
app.use('/protected', protectedRouter);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);

module.exports = app;

