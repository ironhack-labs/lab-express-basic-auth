require('dotenv/config');

require('./db');

const express = require('express');

const hbs = require('hbs');

const app = express();
require('./config')(app);

require('./config/session.config')(app);

app.locals.title = `Iron Music`;

const index = require('./routes/index');
app.use('/', index);

require('./error-handling')(app);

module.exports = app;

