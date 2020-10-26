require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');

//packages used to store user’s session once they are authenticated and keep users logged in.
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);


const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// require database configuration
require('./configs/db.config');

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

const index = require('./routes/index.routes');
app.use('/', index);

//configure the middleware to enable sessions in Express. Use app.use() to configure our middlewares:
session({
    secret: "basic-auth-secret",
    cookie: { maxAge: 60000 },
    store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: 24 * 60 * 60, // 1 day
    }),
    resave: true,
    saveUninitialized: false,
});
//The session package creates a new session middleware with the specified options (secret, cookie, store)


// Routes
app.use('/', require('./routes/auth'));
app.use('/', require('./routes/site-routes'));

module.exports = app;

app.listen(process.env.PORT || 3000);