require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const session = require('express-session');
const connectMongo = require('connect-mongo');

const MongoStore = connectMongo(session);

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// require database configuration
require('./configs/db.config');

app.use(session({
    secret: '6gsdr4g6red846ds4g64d616f1sfsefasgraedsgbrt46s46',
    saveUninitialized: false,
    resave: true,
    rolling: true,
    cookie: { maxAge: 300000 }, // session expire date to 5 minutes
    store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: 60 * 60 * 24,
    }),
}));

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
hbs.registerPartials(path.join(__dirname, 'views/partials'));

// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

const auth = require('./routes/auth.routes');
const index = require('./routes/index.routes');

app.use('/', auth);
app.use('/', index);

module.exports = app;
