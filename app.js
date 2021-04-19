require('dotenv').config();

const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const DBURL = "mongodb://localhost/express-basic-auth-dev";

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// require database configuration
require('./configs/db.config');

// Middleware Setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
    session({
        secret: "basic-auth-secret",
        resave: true,
        saveUninitialized: false,
        cookie: {maxAge: 3600000},
        store: MongoStore.create({
            mongoUrl: DBURL
        })
    })
)

// Express View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

const index = require('./routes/index.routes');
const authRouter = require('./routes/auth.routes');
const privateRouter = require('./routes/private.routes');
const mainRouter = require('./routes/main.routes');
app.use('/', index);
app.use('/auth', authRouter);
app.use('/private', privateRouter);
app.use('/main', mainRouter);

module.exports = app;
