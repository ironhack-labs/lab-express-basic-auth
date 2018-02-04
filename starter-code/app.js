const express        = require("express");
const path           = require("path");
const logger         = require("morgan");
const cookieParser   = require("cookie-parser");
const bodyParser     = require("body-parser");
const mongoose       = require("mongoose");
const expressLayouts = require('express-ejs-layouts');
const app            = express();
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

// Controllers
const index = require('./routes/index');
const auth = require('./routes/auth');
const main = require('./routes/main');
const private = require('./routes/private');

// Mongoose configuration
mongoose.connect('mongodb://localhost/mongoose-auth-boiler', {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE
});

// Middlewares configuration
app.use(logger("dev"));

// View engine configuration
app.use(expressLayouts);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.set('layout', 'layouts/main');

// Access POST params with body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Authentication / Session
app.use(cookieParser());

app.use(
  session({
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60 // 1 day
    }),
    secret: 'foobar',
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000
    }
  })
);

app.use(function(req, res, next) {
  app.locals.user = req.session.currentUser;
  next();
});

// Routes
app.use('/', index);
app.use('/auth', auth);
app.use('/main', main);
app.use('/private', private);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404);
  const data = {
    title: '404 Not Found'
  };
  res.render('not-found', data);
});

app.use(function(err, req, res, next) {
  console.error('ERROR', req.method, req.path, err);
  if (!res.headersSent) {
    const data = {
      title: '500 Ouch'
    };
    res.status(500);
    res.render('error', data);
  }
});

module.exports = app;
