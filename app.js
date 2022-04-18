require('dotenv/config');

require('./db');

const express = require('express');
const app = express();

require('./config')(app);
require('./config/session.config')(app)


app.locals.title = 'BASIC AUTH_Generated with Ironlauncher';

const index = require('./routes/index');
app.use('/', index);

require('./error-handling')(app);

module.exports = app;

