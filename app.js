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


//allow us to use express session // importing th elibraries
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
 
//tell the middle ware im using the session and i am storing in the mongoDB
//we need to change the options
app.use(session({
    secret: 'HiJorge', //so other people cannont access our session from other websites
    saveUninitialized: false, // don't create session until something stored
    resave: false, //don't save session if unmodified
    cookie : {
      maxAge: 24*60*60*1000 //in milliseconds
    }, //how long we want to store the cookies
    store: new MongoStore({
      mongooseConnection: mongoose.connection, //wherever my mongoose is connected, just store the data
      ttl: 24*60*60//always in secondes. Here we are storing for 1 day
    })
    
}));



// Express View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';



//crucial step to link your middleware with auth.routes.js that we just created
//never put 404 first
const index = require('./routes/index.routes');
app.use('/', index);

const authRoutes = require('./routes/auth.routers')
app.use('/', authRoutes);


module.exports = app;
