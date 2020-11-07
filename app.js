require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
// const hbs = require('hbs');
// const mongoose = require('mongoose');
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

//setting hbsHelper
const hbs = require('./configs/hbsHelper')
hbs(app)

// hbs.registerHelper('splitEmail', function (email) {
//     console.log("email first: "+ email)
//     let user = email.split("@");
//     console.log(user)
//     return user[0];
// })

// const session = require("express-session")
// app.use(
//     session({
//         secret: "weyuglqwe",
//             resave: false,
//             saveUninitialized: true,
//             cookie: {
//                 maxAge: 60000
//             }
//     })
// )

const session = require('./configs/session')
session(app)


// Express View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// default value for title local
app.locals.title = 'Basic Auth Lab ';

const index = require('./routes/index.routes');
const auth = require('./routes/auth.routes');


app.use('/', index);
app.use('/', auth)

module.exports = app;
