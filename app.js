require('dotenv/config');
require('./db');


const express = require('express');
const hbs = require('hbs');

const app = express();
app.set('view engine', 'hbs');

require('./config')(app)
require("./config/session.config")(app)

const projectName = 'SECRET CULT';
const capitalized = string => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`;

// 👇 Start handling routes here
const indexRoutes = require('./routes/index.routes');
app.use('/', indexRoutes);

const authRoutes = require("./routes/auth.routes")
app.use('/', authRoutes)

const privateRoutes = require("./routes/private.routes")
app.use('/', privateRoutes)

require('./error-handling')(app);

module.exports = app;

