require('dotenv/config');

require('./db');

const express = require('express');

const hbs = require('hbs');

const app = express();

require('./config')(app);

const projectName = 'B_auth';
const capitalized = string => string[0].toUpperCase() + string.slice(1).toLowerCase();

require('./config/session.config')(app)

app.locals.title = `${capitalized(projectName)}`;

const index = require('./routes/index');
app.use('/', index);

const authRoutes = require('./routes/auth.routes');
app.use("/", authRoutes);

require('./error-handling')(app);

module.exports = app;
