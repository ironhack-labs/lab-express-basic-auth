const express        = require("express");
const path           = require("path");
const logger         = require("morgan");
const cookieParser   = require("cookie-parser");
const bodyParser     = require("body-parser");
const mongoose       = require("mongoose");
const session        = require("express-session");
const MongoStore     = require("connect-mongo")(session);
const app            = express();
const expressLayouts = require('express-ejs-layouts');


// Controllers
var index            = require("./routes/index");
const signUp         = require('./routes/signUp');
const authRoutes     = require('./routes/authRoutes');

// Mongoose configuration
mongoose.connect("mongodb://localhost/lab-basic-auth");
// Middlewares configuration
app.use(logger("dev"));
app.use(expressLayouts);
// View engine configuration
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.set("layout", "layouts/main");
// Access POST params with body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Authentication
app.use(cookieParser());

// Routes
app.use(session({
  secret: "myLittleSecret",
  cookie: {maxAge:600000},
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60
  })
}));
app.use("/", index);
app.use("/signUp", signUp);
app.use("/", authRoutes);
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
