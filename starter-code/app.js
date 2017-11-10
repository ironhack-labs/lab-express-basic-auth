const express        = require("express");
const path           = require("path");
const logger         = require("morgan");
const cookieParser   = require("cookie-parser");
const session = require("express-session");
const mongoStore = require("connect-mongo")(session);
const bodyParser     = require("body-parser");
const mongoose       = require("mongoose");
const app            = express();
const debug = require('debug')('basic-auth:'+ path.basename(__filename));

// Controllers
const registerRouter = require('./routes/auth')

// Mongoose configuration
const dbName = "mongodb://localhost/basic-auth";
mongoose.connect(dbName, {useMongoClient:true})
        .then(() => debug(`Connected to db: ${dbName}`));

// Middlewares configuration
app.use(logger("dev"));

// View engine configuration
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// Access POST params with body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Authentication
app.use(cookieParser());

app.use(session({
  secret: "basic-auth-secret",
  cookie:{maxAge:60*60*24*2},
  store: new mongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24*60*60
  })
}));



app.use((req,res,next) =>{
  res.locals.title = "TITULO POR DEFECTO";
  res.locals.user = req.session.currentUser;
  next();
})

// Routes
app.use('/', registerRouter);

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
