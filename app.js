require('dotenv/config');

require('./db');

const express = require('express');

const hbs = require('hbs');

const app = express();

require('./config')(app);

const projectName = 'lab-express-basic-auth';
const capitalized = string => string[0].toUpperCase() + string.slice(1).toLowerCase();

require("./config/session.config")(app)

app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`;

const index = require('./routes/index');
app.use('/', index);

const private = require('./routes/private.routes')
app.use('/', private)

const auth = require("./routes/auth.routes")
app.use("/", auth)

require('./error-handling')(app);

module.exports = app;

