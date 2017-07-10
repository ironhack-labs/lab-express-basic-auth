const express        = require("express");
const path           = require("path");
const logger         = require("morgan");
const cookieParser   = require("cookie-parser");
const bodyParser     = require("body-parser");
const mongoose       = require("mongoose");
const app            = express();

const bcrypt         = require('bcrypt');
const authRoutes     = require('./routes/auth-routes');
const siteRoutes     = require('./routes/site-routes');

const session        = require("express-session");
const userData       = require('connect-mongo') (session);



// Controllers

// Mongoose configuration
mongoose.connect("mongodb://localhost/basic-auth");

// Middlewares configuration
app.use(logger("dev"));

app.use(session ({
  secret: "basic-auth-secret",
  cookie: { maxAge: 30000 },
  store: new userData({
    mongooseConnection: mongoose.connection,
  ttl: 24 * 60 * 60
  })
}));

// View engine configuration
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// Access POST params with body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Authentication
app.use(cookieParser());

// Routes
app.use('/', authRoutes);
app.use('/', siteRoutes);



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
