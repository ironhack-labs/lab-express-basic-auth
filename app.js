require('dotenv/config');
require('./db');

const express = require('express');
const hbs = require('hbs');
const app = express();
const bcrypt = require('bcryptjs')
const saltRounds = 10

require('./config')(app);
require("./config/session.config.js")(app);

app.locals.appTitle = `Basic Auth`;

const salt = bcrypt.genSaltSync(saltRounds)

const indexRoute = require('./routes/index.routes');
app.use('/', indexRoute);

const authRoute = require('./routes/auth.routes');
app.use('/', authRoute);

const usersRoute = require('./routes/users.routes');
app.use('/', usersRoute);


require('./error-handling')(app);

module.exports = app;

