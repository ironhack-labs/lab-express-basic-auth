require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);
const indexRouter = require('./routes/index.routes');
const authRouter = require('./routes/auth');
const main = require('./routes/main');
const private = require('./routes/private');



const app = express();

require ( './configs/db.config' ) ;

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
    secret: "basic-auth-secret",
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60 // 1 day
    }),
    resave: true,
    saveUninitialized: true
  }));

// Express View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

app.use("/auth", authRouter);
app.use("/", indexRouter);
app.use('/', main);
app.use('/', private);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
  });
  
  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render("error");
  });
module.exports = app;
