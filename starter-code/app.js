const express        = require("express");
const path           = require("path");
const logger         = require("morgan");
const cookieParser   = require("cookie-parser");
const bodyParser     = require("body-parser");
const expressLayouts = require('express-ejs-layouts');
const mongoose       = require("mongoose");
const session        = require('express-session');
const MongoAuth      = require('connect-mongo')(session);

const app            = express();

const index = require('./routes/index');
const auth = require('./routes/auth');
const user = require('./routes/user');
const private = require('./routes/privates');

// Controllers

// Mongoose configuration
mongoose.connect("mongodb://localhost/basic-auth", { useMongoClient: true });
mongoose.Promise = global.Promise;

// Middlewares configuration
app.use(logger("dev"));

// View engine configuration
app.use(expressLayouts);
app.set('layout', 'layouts/main');
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// Access POST params with body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Authentication
app.use(cookieParser());
app.use(session({
  secret: 'basic-auth',
  cookie: { maxAge: 6000 },
  store: new MongoAuth({
    mongooseConnection: mongoose.connection,
    ttl: 26 * 60 * 60,
  }),
  resave: true,
  saveUninitialized: true,
}));

// Routes
app.use('/', index);
app.use('/', auth);
app.use('/', user);
app.use('/', private);

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
