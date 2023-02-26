require('dotenv/config');
require('./db');

const express = require('express');
const hbs = require('hbs');
const { discriminator } = require('./models/User.model');

const app = express();
require('./config/session.config')(app);

// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require('./config')(app);

// default value for title local
const projectName = 'lab-express-basic-auth';
const capitalized = (string) =>
  string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`;

// 👇 Start handling routes here
const index = require('./routes/index');
app.use('/', index);

const main = require('./routes/main.routes');
app.use('/', main);

const private = require('./routes/private.routes');
app.use('/', private);

// 👇 Authorization Routes
const authRouter = require('./routes/auth.routes');
app.use('/', authRouter);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);

module.exports = app;
