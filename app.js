require('dotenv').config();
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const MongoStore = require('connect-mongo')(session);
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

const router = require('./routes/index.routes');

app.use(
    session({
        secret: 'secret',
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 600000 },
        store: new MongoStore({
            // <== ADDED !!!
            mongooseConnection: mongoose.connection,
            // ttl => time to live
            ttl: 60 * 60 * 24 // 60sec * 60min * 24h => 1 day
        })
    })
);

app.use('/', router);

module.exports = app;