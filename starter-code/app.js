const express        = require("express");
const path           = require("path");
const logger         = require("morgan");
const cookieParser   = require("cookie-parser");
const bodyParser     = require("body-parser");
const mongoose       = require("mongoose");
const expressLayouts = require("express-ejs-layouts");

const index = require('./routes/user');

const app            = express();

// Controllers

// Mongoose configuration
mongoose.connect("mongodb://localhost/basic-auth",{useMongoClient: true})
        .then(()=>console.log("Connected to DB"));
// Middlewares configuration


// View engine configuration
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("layout","layout");


app.use(express.static(path.join(__dirname, "public")));

// Access POST params with body parser
app.use(expressLayouts);
app.use(logger("dev"));app.use(expressLayouts);
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', index);
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
