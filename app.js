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

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
 
app.use(session({
  secret: 'my-pet-cat',
  cookie: {
    maxAge: 60*60*24*1000 // 1day // in milliseconds 
  },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 60*60*24 // 1 day // value in seconds
  })
})); 

//Routes middleware
const index = require('./routes/index.routes');
app.use('/', index);

const authRouter = require('./routes/auth.routes');
app.use('/', authRouter);


app.get('/', (req, res, next)=>{
    if(req.session.loggedInUser === true){
      next()
    }
    else{
      res.render('index.hbs')
    }
  })

const private = require('./routes/private.routes');
app.use('/', private );

module.exports = app;
