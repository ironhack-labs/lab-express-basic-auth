
require('dotenv/config');

require('./db');

const express = require('express');
const hbs = require('hbs');

const app = express();

require('./config')(app);
require("./config/sesion.config")(app)

const projectName = 'lab-express-basic-auth';
const capitalized = string => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`;



const index = require('./routes/index');
app.use('/', index);

const auth = require('./routes/auth.routes')
app.use('/', auth)

const user = require('./routes/user.routes')
app.use('/', user)

require('./error-handling')(app);

module.exports = app;

