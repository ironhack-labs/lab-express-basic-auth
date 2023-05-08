
require('dotenv/config');

require('./db');

const express = require('express');

const hbs = require('hbs');

const app = express();

require('./config')(app);
require("./config/session.config")(app)

const projectName = 'lab-express-basic-auth';
const capitalized = string => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.siteTitle = `Our Favorite Operas`

// 👇 Start handling routes here
const index = require('./routes/index');
app.use('/', index);
const operasRoutes = require('./routes/operas.routes.js')
app.use('/', operasRoutes)
const authRoutes = require('./routes/auth.routes.js')
app.use('/', authRoutes)
const userRoutes = require('./routes/user.routes.js')
app.use('/', userRoutes)

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);


module.exports = app;

