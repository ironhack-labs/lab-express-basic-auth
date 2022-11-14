
require('dotenv/config');

require('./db');

const express = require('express');

const hbs = require('hbs');

const app = express();

require('./config')(app);

// default value for title local
const projectName = 'lab-express-basic-auth';
const capitalized = string => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`;


// 👇 Start handling routes here

require('./config/session.config')(app)

const index = require('./routes/index');
app.use('/', index);

const authRoutes = require("./routes/auth.routes");
app.use("/", authRoutes);



require('./error-handling')(app);

module.exports = app;

