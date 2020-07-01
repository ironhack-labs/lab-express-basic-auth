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
// Express Session setup
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        cookie: { maxAge: 24 * 60 * 60 * 1000 },
        // session is uninitialized when it is new but not modified - default is false
        saveUninitialized: false,
        //Forces the session to be saved back to the session store, 
        // even if the session was never modified during the request.
        resave: true,
        store: new MongoStore({
            //When the session cookie has an expiration date, connect-mongo will use it.
            // Otherwise, it will create a new one, using ttl option - here ttl is one day.
            mongooseConnection: mongoose.connection,
            ttl: 24 * 60 * 60 * 1000
        })
    })
);

const index = require('./routes/index.routes');
app.use('/', index);


const authRoutes = require("./routes/auth");
app.use("/", authRoutes);

const profileRoutes = require("./routes/profile");
app.use("/", profileRoutes);


module.exports = app;
