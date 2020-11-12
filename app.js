require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const helpers      = require('handlebars-helpers');
const session      = require('express-session');
const MongoStore   = require('connect-mongo') (session);


//Register helpers list from handlebars-helpers
hbs.registerHelper(helpers());



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


//Express Session of User setup - after click Login
app.use(
    session({
      secret: 'mysecret', 
      cookie: {maxAge: 60000},
      rolling: true, //as long as we are touch the site the session doesn not expire if its set to TRUE
      store: new MongoStore({
        mongooseConnection: mongoose.connection
      })
    })
  )


// default value for title local
//app.locals.title = 'Express - Generated with IronGenerator';

const index = require('./routes/index.routes');
app.use('/', index);

const auth = require('./routes/auth.routes');
app.use('/', auth);

module.exports = app;
