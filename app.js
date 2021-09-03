require('dotenv/config');

require('./db');

const express = require('express');


const app = express();

require('./config')(app);
require('./config/session.config')(app)


const projectName = 'AUTH';
const capitalized = string => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}`;

const index = require('./routes/index');
app.use('/', index);

require('./error-handling')(app);

module.exports = app;

