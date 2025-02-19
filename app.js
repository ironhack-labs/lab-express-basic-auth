
require('dotenv/config');
require('./db');
require("./config/hbs.config");
const { sessionConfig, loggedUser } = require("./config/session.config");


const express = require('express');
const hbs = require('hbs');
const app = express();


require('./config')(app);


const projectName = 'lab-express-basic-auth';
const capitalized = string => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`;

app.use(sessionConfig);
app.use(loggedUser);

const index = require('./routes/index');
app.use('/', index);

require('./error-handling')(app);

module.exports = app;

