require('dotenv/config');
require('./db');

const express = require('express');
const hbs = require('hbs');
const app = express();

require('./config')(app);
require('./config/session.config')(app)

app.locals.title = `Express-basic-auth`;

const index = require('./routes/index');
app.use('/', index);

const authRoutes = require('./routes/auth.router');
app.use("/", authRoutes)

const contentRoutes = require('./routes/content.router');
app.use("/", contentRoutes)

require('./error-handling')(app);

module.exports = app;

