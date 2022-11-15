// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv/config');

require('./db');


const { loggedIn } = require('./middleware/route-guard');

const express = require('express');

const hbs = require('hbs');

const app = express();

require('./config')(app);

require('./config/session.config')(app)

const projectName = 'lab-express-basic-auth';
const capitalized = string => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`;
app.locals.logged = loggedIn


const index = require('./routes/index');
const auth = require('./routes/auth.routes')
app.use('/', auth)
app.use('/', index);

require('./error-handling')(app);

module.exports = app;

