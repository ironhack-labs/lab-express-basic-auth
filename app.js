// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv/config');

// ℹ️ Connects to the database
require('./db');

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require('express');

const cookieParser = require('cookie-parser');

const { sessionConfig , currentUser } = require('./config/session.config');

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require('hbs');
hbs.registerPartials(__dirname + '/views/partials');


const app = express();



// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require('./config')(app);

app.use(cookieParser());

// default value for title local
const projectName = 'lab-express-basic-auth';
const capitalized = string => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`;

// Session middleware
app.use(sessionConfig);
app.use(currentUser);

// Routers
const indexRouter = require('./routes/index');

// Routes middleware
app.use('/', indexRouter);

// 👇 Start handling routes here
const index = require('./routes/index');
app.use('/', index);
const authRouter = require('./routes/auth.routes');
app.use('/', authRouter);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);

module.exports = app;

