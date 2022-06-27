
require('dotenv/config');

require('./db');

const express = require('express');

const hbs = require('hbs');

const app = express();


require('./config')(app);

require("./config/session.config")(app)         // session setup

app.locals.title = `auth`;

// 👇 Start handling routes here
const index = require('./routes/index');
app.use('/', index);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);

module.exports = app;

