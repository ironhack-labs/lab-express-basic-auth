require('dotenv').config();
const session = require("express-session");
const MongoStore = require("connect-mongo")(session)

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

app.use(session({
    secret: "express-basic-auth-dev",
    cookie: { maxAge: 60000 },
    store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: 24 * 60 * 60 // 1 day
    })
}))



// Express View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// default value for title local
app.locals.title = 'INICIO TO GUAPO';


//BASE URLS
app.use('/', require('./routes/auth.routes'))

app.use('/', require('./routes/base.routes'))

app.use('/', require('./routes/site-routes'))

app.use('/', require('./routes/index.routes'))





module.exports = app;
