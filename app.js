const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session    = require("express-session");
const MongoStore = require("connect-mongo")(session);
const mongoose = require('mongoose');

const signupRouter = require('./routes/signup');
const loginRouter = require('./routes/login');
const homeRouter = require('./routes/home');
const mainRouter = require('./routes/main');
const privateRouter = require('./routes/private');
const logoutRouter = require('./routes/logout');
const privateMiddleware = require('./routes/privateMiddleware');


const app = express();

mongoose.connect('mongodb://localhost/basic-auth-lab');








// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  }),
  secret: 'some-string',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000
  }
}));


app.use('/signup', signupRouter);
app.use('/login', loginRouter);
app.use('/home', homeRouter);
app.use('/main', mainRouter);
app.use('/private', privateMiddleware.requireUser ,privateRouter);
app.use('/logout', logoutRouter);













// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.locals.currentUser = req.session.currentUser;
  next();

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
