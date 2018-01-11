const express       = require("express");
const path          = require("path");
const logger        = require("morgan");
const cookieParser  = require("cookie-parser");
const bodyParser    = require("body-parser");
const mongoose      = require("mongoose");
const app           = express();

// Authorization & Authentication
const session       = require("express-session");
const MongoStore    = require("connect-mongo")(session);   

// Routes
const authRoutes    = require('./routes/auth-routes');

// Routes available to user once he / she signs in
const siteRoutes    = require('./routes/site-routes');

// Controllers

// Mongoose configuration
mongoose.connect("mongodb://localhost/basic-auth");

// Middlewares configuration
app.use(logger("dev"));

// Configure Middleware to enable sessions in Express
app.use(session({
  // Use to sign the session ID cookie (REQUIRED)
  secret: "basic-auth-secret",
  
  // Object for the session ID cookie
  // Sets the expiration date of the cookie (in milliseconds)
  cookie: { maxAge: 60000 },

  // Sets the session store inheritance
  // We create a new instance of "connect-mongo" so that
  // we can store the session information in our Mongo database
  store: new MongoStore({
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

// Auth Routes Configuration
// Why does this line of code allow the login form to appear?
app.use('/', authRoutes);

// Site Routes Configuration
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
