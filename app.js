// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv/config');

// ℹ️ Connects to the database
require('./db');
const isLoggedIn = require('./middleware/loggedIn.middleware')
// const layoutLogged = require('./middleware/layoutlogged.middleware')

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require('express');

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require('hbs');

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require('./config')(app);
require('./config/session.config')(app);

// default value for title local
const projectName = 'lab-express-basic-auth';
const capitalized = string => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`;

const isLayoutLoggedIn = require('./middleware/layoutlogged.middleware')
app.use(isLayoutLoggedIn)

// 👇 Start handling routes here
const index = require('./routes/index');
app.use('/', index);

const auth = require('./routes/auth.routes');
app.use('/auth', auth);

const private = require('./routes/private.routes');
app.use('/private', isLoggedIn, private);

const main = require('./routes/main.routes');
app.use('/main', isLoggedIn, main);


// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);

module.exports = app;

