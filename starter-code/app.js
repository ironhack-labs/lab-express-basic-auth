const express        = require("express");
const path           = require("path");
const logger         = require("morgan");
const cookieParser   = require("cookie-parser");
const bodyParser     = require("body-parser");
const mongoose       = require("mongoose");
const app            = express();
const session        = require("express-session");
const MongoStore     = require("connect-mongo")(session);
const expressLayouts = require('express-ejs-layouts');


const routes = require('./routes/index');
const authController = require('./routes/authController');
const welcomeController = require('./routes/welcomeController');


// Mongoose configuration
mongoose.connect("mongodb://localhost/basic-auth");


// View engine configuration
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("layout", "layouts/main-layout");


app.use(logger("dev"));
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Session Middleware
app.use(session({
  secret: "basic-auth-secret",
  cookie: { maxAge: 60000 },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  })
}));

// Routes


// Controllers
app.use('/', routes);
app.use('/', authController);
app.use('/welcome', welcomeController);


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
