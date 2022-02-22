// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv/config');

// ℹ️ Connects to the database
require('./db');

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require('express');
const MongoStore = require('connect-mongo');
// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require('hbs');

const app = express();
const session = require('express-session');

// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require('./config')(app);

// default value for title local
const projectName = 'lab-express-basic-auth';
const capitalized = string => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`;

app.use(session({
    secret: 'keyboardcat',
    resave: true,
    saveUninitialized: false,
    cookie: {
        httpOnly: true
    },
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        ttl: 60
    })
}));

// 👇 Start handling routes here
const index = require('./routes/index');
app.use('/', index);

const authRoutes = require('./routes/auth.routes');
app.use('/', authRoutes);

const privateRoutes = require('./routes/protect.routes');
app.use('/', privateRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);

module.exports = app;

