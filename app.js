require('dotenv').config();
// require('dotenv').config({path: __dirname + '/.env'})
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');

const session = require("express-session")


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
app.locals.title = 'Lab-express-basic-auth';

const index = require('./routes/index.routes');
const auth = require("./routes/auth")
app.use('/', index);
app.use("/", auth)
// app.use(
//   session({
//     secret: "weyuglqwe",
//     resave: false,
//     saveUninitialized: true,
//     cookie: { maxAge: 60000 }
//   })
// )




module.exports = app;
// console.log(process.env.PORT);
app.listen(process.env.PORT, () => console.log(`on port ${process.env.PORT} `));
