require('dotenv').config();

const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const logger = require('morgan');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { mongoUrl } = require('./configs/db.config');
const hbs = require('hbs');

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

//HBS custom helper
hbs.registerHelper("random", function (a, b, options) {
    return `${Math.floor((b - a) * Math.random()) + a}`
});

// require database configuration
require('./configs/db.config');

// Middleware Setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    store: MongoStore.create({
        mongoUrl: mongoUrl,
    })
}))

// Express View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// default value for title local
app.locals.title = 'Basic Auth Lab';

const index = require('./routes/index.routes');
app.use('/', index);
app.use('/', require('./routes/auth.routes'));

module.exports = app;
