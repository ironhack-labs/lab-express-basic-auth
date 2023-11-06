require('dotenv/config');

require('./db');

const express = require('express');

const hbs = require('hbs');

const app = express();

require('./config')(app);
require('./config/session.config')(app)

app.locals.title = 'Basic Auth generated with Ironlauncher';

const index = require('./routes/index');
app.use('/', index);

const authRoutes = require('./routes/auth.routes')
app.use('/', authRoutes)

const otherRoutes = require('./routes/other.routes')
app.use('/', otherRoutes)

require('./error-handling')(app);

module.exports = app;

