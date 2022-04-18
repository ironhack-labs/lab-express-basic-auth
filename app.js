require('dotenv/config');

require('./db');

const express = require('express');

const hbs = require('hbs');

const app = express();

require('./config')(app);
require('./config/session.config')(app)


app.locals.appTitle = 'Auth Express Basic App'

const index = require("./routes/index.routes")
app.use("/", index)

require('./error-handling')(app);

module.exports = app;

