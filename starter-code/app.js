const express        = require("express");
const path           = require("path");
const logger         = require("morgan");
const cookieParser   = require("cookie-parser");
const bodyParser     = require("body-parser");
const expressLayouts = require("express-ejs-layouts");
const mongoose       = require("mongoose");
const session        = require("express-session");
const MongoStore     = require("connect-mongo")(session);

const authRouter     = require("./routes/auth");
const indexRouter    = require("./routes/index");
const {dbURL} = require('./conf/db');

const app = express();

app.use((req,res,next) => {
  res.locals.title = 'Basic Auth Form';
  next();
});

// Controllers
app.use('/', indexRouter);
app.use('/auth', authRouter);

// Mongoose configuration
mongoose.connect(dbURL, {useMongoClient: true})
        .then(() => console.log('Conectado a la BBDD'));

// Middlewares configuration
app.use(logger("dev"));

// View engine configuration
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.set("layouts", "layout/layout");

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
  res.render("error", {error:err});
});

module.exports = app;
