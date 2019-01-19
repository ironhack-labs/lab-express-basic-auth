require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const logger       = require('morgan');
const path         = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');

require('./config/db.config');

const authRouter = require('./routes/auth.router');

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

app.use(session({
  name: 'register_lab',
  secret: process.env.COOKIE_SECRET || 'SuperSecret',
  resave: true, 
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE || false,
    expires: 60 * 60 * 24 * 1000 * 7
  }, 
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 60 * 60 * 24 * 1000 * 7
  })
}))



// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

app.use('/auth', authRouter);

const index = require('./routes/index');
app.use('/', index);


module.exports = app;
