require('dotenv/config');

require('./db');

const express = require('express');

const hbs = require('hbs');

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require('./config')(app);
hbs.registerPartials(__dirname + "/views/partials");


// 👇 Start handling routes here
const routes = require('./config/routes.config');
app.use('/', routes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);

module.exports = app;

