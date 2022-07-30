require('dotenv/config');

// ℹ️ Connects to the database
require('./config/db.config');

const express = require('express');

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const hbs = require('hbs');

const app = express();

// ℹ️ global package used to `normalize` paths amongst different operating systems
// https://www.npmjs.com/package/path
const path = require("path");

// Register the location for handlebars partials here:
hbs.registerPartials(path.join(__dirname + "/views/partials"));

// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require('./config/app.config')(app);

// default value for title local
const projectName = 'lab-express-basic-auth';
const capitalized = string => string[0].toUpperCase() + string.slice(1).toLowerC
app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`;

// 👇 Start handling routes here
const home = require('./routes/home');
app.use('/', home);

const users = require('./routes/users');
app.use('/', users)

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling/error.handle')(app);

module.exports = app;