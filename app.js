require('dotenv').config();

const bodyParser    = require('body-parser');
const cookieParser  = require('cookie-parser');
const express       = require('express');
const favicon       = require('serve-favicon');
const hbs           = require('hbs');
const mongoose      = require('mongoose');
const logger        = require('morgan');
const path          = require('path');
const bcrypt        = require ("bcryptjs");
const dotenv        = require ("dotenv");

const session       = require ("express-session");
const MongoStore    = require ("connect-mongo")(session);

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

const User = require('./models/User.model.js')

// require database configuration
require('./configs/db.config');

//COOKIES CONFIGURATION
app.use(session({
  secret: "basic-auth-secret",
  // cookie: { maxAge: 60000 },
  saveUninitialized: true,
  resave: true,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  })
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

// default value for title local
app.locals.title = 'Basic Auth - Ironhack Lab';

const index = require('./routes/index.routes');
app.use('/', index);

const router = require('./routes/auth.routes');
app.use('/', router);


module.exports = app;