require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

//Connect sessions
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

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

app.use(session(
    {
  secret: 'my-secret-pencil',
  saveUninitialized: false,
  resave: false,
  //Cookies are for browser
  cookie: {
    maxAge: (60*60*24) * 1000
  },
  //store it in database
  store: new MongoStore({
      
      url: 'mongodb://localhost/express-basic-auth-dev', //path of compass
      ttl: 60*60*24,//time to live (in seconds)
      autoRemove: 'disabled'
  })

}));

// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';


const indexRouter = require('./routes/index.routes');
const authRouter = require('./routes/auth.routes');

// Routes middleware
app.use('/', indexRouter)
app.use('/', authRouter)



 



  



module.exports = app;
