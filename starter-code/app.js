const express        = require("express");
const path           = require("path");
const favicon = require('serve-favicon');
const logger         = require("morgan");
const cookieParser   = require("cookie-parser");
const bodyParser     = require("body-parser");
//rsconst expressLayouts  = require("express-ejs-layouts");
const mongoose       = require("mongoose");
//const session = require('express-session');
//const MongoStore = require("connect-mongo")(session);
const app            = express();
const bcrypt         = require('bcrypt');
// Controllers
const authRoutes = require('./routes/auth-routes');
const user = require('./routes/user.routes');
// Mongoose configuration
mongoose.connect("mongodb://localhost/basic-auth");

// Middlewares configuration
app.use(logger("dev"));

// View engine configuration
app.use(expressLayouts);
app.set('layout', 'layouts/main');
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// Access POST params with body parser
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Authentication
app.use(cookieParser());
app.use(session({
   secret: 'Super Secret',
   resave: false,
   saveUninitialized: true,
   cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 1000
    },
    store: new MongoStore({
     mongooseConnection: mongoose.connection,
     ttl: 24 * 60 * 60
   })
 }));

// Routes
app.use('/', auth);
app.use('/users', users);

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
