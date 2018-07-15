const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const app = express();
const session = require("express-session");

app.use(session({
  secret: 'SuperSecret - (Change it)',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 60 * 1000
  }
}));

require("./configs/db.config");
require("./configs/hbs.config");
// require("./configs/session.config")(app);

const usersRouter = require("./routes/user.routes");
const sessionsRouter = require("./routes/session.routes");
const dashboard = require("./routes/dashboard.routes");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/users", usersRouter);
app.use("/sessions", sessionsRouter);

app.use((req, res, next) => {
  res.locals.session = req.session.currentUser;  
  next();  
}); 

app.use("/", dashboard);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("errors");
});

module.exports = app;
