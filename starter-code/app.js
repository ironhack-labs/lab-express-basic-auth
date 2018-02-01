const express = require("express");
const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const app = express();

// Controllers
const auth = require('./routes/auth');
const index = require('./routes/index');

// Mongoose configuration
mongoose.connect("mongodb://localhost/basic-auth");
mongoose.Promise = global.Promise;

// Middlewares configuration
app.use(logger("dev"));

// View engine configuration
app.use(expressLayouts);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main');
app.use(session({
  secret: 'manu',
  cookie: { maxAge: 360000 },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60, // 1 day
  }),
}));

// Access POST params with body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Authentication
app.use(cookieParser());

// Routes
app.use('/', auth);
app.use('/', index);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
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