const express = require("express");
const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const favicon = require('serve-favicon');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
// const expressLayouts = require('express-ejs-layouts');


// Controllers
var index = require('./routes/index');
var user = require('./routes/user');
var authRoutes = require('./routes/authRoutes');

// Mongoose configuration
mongoose.connect("mongodb://localhost/basic-auth");

// Middlewares configuration
app.use(logger("dev"));

// View engine configuration
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// ...other code
// app.use(expressLayouts);
// app.set("layout", "main-layout");

// IMPORTANT Create new session and cookie
app.use(session({
  secret: "mysecretauth",
  cookie: { maxAge: 60000 },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  })
}));

// Authentication
app.use(logger('dev'));
app.use(cookieParser());


// Access POST params with body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));


// Routes
app.use('/', index);
app.use('/auth', authRoutes);
app.use('/user', user);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
