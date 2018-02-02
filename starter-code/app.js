const express        = require("express");
const path           = require("path");
const logger         = require("morgan");
const cookieParser   = require("cookie-parser");
const bodyParser     = require("body-parser");
const debug = require('debug')(`LAB-EXPRESS-BASIC-AUTH${path.basename(__filename).split('.')[0]}`);
const mongoose       = require("mongoose");
const app            = express();
const bcrypt         = require("bcrypt")
const saltRounds     = 20;
const index = require ("./routes/index")
const session = require ("express-session");
const MongoStore = require ("connect-mongo")(session);
const authRoutes = require ("./routes/auth-routes");
const homeRoutes = require ("./routes/home");




// Controllers

// Mongoose configuration
mongoose.connect("mongodb://localhost/mongoose-User").then(() => {
  console.log("CONECTADO A LA BASE DE DATOS");
})

// Middlewares configuration
app.use(logger("dev"));


// View engine configuration
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// Access POST params with body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
 app.use(session({
   secret: "basic-auth-secret",
   cookie: { maxAge: 60000 },
   store: new MongoStore({
     mongooseConnection: mongoose.connection,
     ttl: 24 * 60 * 60 // 1 day
   })
 }));
 app.use((req, res, next) => {
   res.locals = {
     title: 'DEFAULT',
     user: req.session.currentUser || null
   }
   next();
 });

// Authentication
app.use(cookieParser());

// Routes
app.use("/", index);
app.use("/auth", authRoutes);
app.use("/", homeRoutes);



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
