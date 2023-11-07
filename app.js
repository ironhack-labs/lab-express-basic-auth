require('dotenv/config');
require('./db');

const express = require('express');
const hbs = require('hbs');

const app = express();

require('./config')(app);
require('./config/session.config')(app);

const projectName = 'Basic-auth';
const capitalized = string => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}`;


const indexRoutes = require('./routes/index.routes');
app.use('/', indexRoutes);

const authRoutes = require('./routes/auth.routes');
app.use('/', authRoutes);

const userRoutes = require('./routes/user.routes');
app.use('/', userRoutes);

require('./error-handling')(app);

module.exports = app;

