
require('dotenv').config()
require('./db')

const express = require('express');
const hbs = require('hbs');
const app = express();


require('./config')(app);
require('./config/session.config')(app)

const projectName = 'b_Auth';
const capitalized = string => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}`;

// 👇 Start handling routes here
const index = require('./routes/index');
app.use('/', index);

const authRoutes = require('./routes/auth.routes')
app.use('/', authRoutes)

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);

module.exports = app;

