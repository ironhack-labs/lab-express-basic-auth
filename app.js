require('dotenv').config();

const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const bcrypt = require('bcrypt');


const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// require database configuration
require('./configs/db.config');

//session config
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
// const mongoose = require('./configs/db.config')
 app.use(
     session({
         secret: process.env.SESSION_SECRET,
         cookie: {maxAge: 1000*60*60*24},
         saveUninitialized: false,
         resave: true,
         store: new MongoStore({
             mongooseConnection : mongoose.connection
         })
     })
 )

//end of session config 
// Middleware Setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
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
const auth = require('./routes/auth');
// const MongoStore = require('connect-mongo');
app.use('/', auth);


module.exports = app;
