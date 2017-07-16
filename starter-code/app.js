const express        = require("express");
const path           = require("path");
const logger         = require("morgan");
const cookieParser   = require("cookie-parser");
const bodyParser     = require("body-parser");
const mongoose       = require("mongoose");
const app            = express();

//mongoose connection
mongoose.connect('mongodb://localhost:27017/lab-basic-auth'); //BBDDD que te quieres conectar
//session 
const session    = require("express-session");
const MongoStore = require("connect-mongo")(session);


// Controllers
var auth = require('./routes/auth');
var index = require('./routes/index');



// Middlewares configuration
app.use(logger("dev"));

// View engine configuration
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

/**
 * The session package creates a new session middleware with the specified options. Here are the options we are using:

secret: Used to sign the session ID cookie (required)
cookie: Object for the session ID cookie. In this case, we only set the maxAge attribute, which configures the expiration date of the cookie (in milliseconds).
store: Sets the session store instance. In this case, we create a new instance of connect-mongo, so we can store the session information in our Mongo database.
 */
app.use(session({
  secret: "basic-auth-secret",
  cookie: { maxAge: 60000 },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  })
}));

// Access POST params with body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Authentication
app.use(cookieParser()); //??

// Routes
app.use('/', index);
app.use('/', auth);

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
