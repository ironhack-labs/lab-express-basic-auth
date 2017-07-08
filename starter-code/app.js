const express        = require("express");
const path           = require("path");
const logger         = require("morgan");
const cookieParser   = require("cookie-parser");
const bodyParser     = require("body-parser");
const mongoose       = require("mongoose");
const index          = require("./routes/index");
const auth          = require("./routes/auth");
// BCrypt to encrypt passwords
const tweetnacl      = require("tweetnacl");
const bcryptSalt     = 10;
const app            = express();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const salt           = bcrypt.genSaltSync(saltRounds);
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';
// Controllers

// Mongoose configuration
mongoose.connect("mongodb://localhost/basic-auth");

// Middlewares configuration
app.use(logger("dev"));

// View engine configuration
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', index);
app.use('/auth', auth);

// Access POST params with body parser

// Authentication
app.use(cookieParser());

// Routes

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
