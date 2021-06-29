// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv/config');

// ℹ️ Connects to the database
require('./db');

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require('express');

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require('hbs');

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require('./config')(app);

// default value for title local
const projectName = 'lab-express-basic-auth';
const capitalized = string => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`;

const session = require('express-session')
const MongoStore = require('connect-mongo')

const sess = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 12*60*60*1000
    },
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI ||  "mongodb://localhost/basic-auth",
        ttl: 12 * 60 * 60
    })
}

app.use(session(sess))
// 👇 Start handling routes here
const index = require('./routes/index');
app.use('/', index);

const authRoute = require('./routes/auth.route')
app.use('/', authRoute);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);

module.exports = app;

