require('dotenv/config');
require('./db');
const express = require('express');
const hbs = require('hbs');
const app = express();

require('./config')(app);
require('./config/session.config')(app)
app.locals.appTitle = 'BasicAuthApp';

const index = require('./routes/index');
app.use('/', index);
const authRoutes = require("./routes/auth.routes");
app.use("/", authRoutes);

require('./error-handling')(app);

module.exports = app;

