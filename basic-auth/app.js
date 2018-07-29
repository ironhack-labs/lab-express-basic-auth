const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');

const dbName = 'Basic-Auth';
mongoose.connect(`mongodb://localhost:27017/${dbName}`, { useNewUrlParser: true })
  .then(() => {
    console.log('database connected');
  })
  .catch((error) => {
    console.log(error);
  });

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const mainRouter = require('./routes/main');
const privateRouter = require('./routes/private');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(session({
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60, // 1 day
  }),
  secret: 'ironhack',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 24 * 60 * 60 * 1000 },
}));


app.use(flash());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'private')));

app.use((req, res, next) => {
  app.locals.currentUser = req.session.currentUser;
  next();
});
// app.use();
app.use('/', indexRouter);
app.use('/auth', usersRouter);
app.use('/main', (req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    req.flash('error', 'login is required');
    res.redirect('/auth/login');
  }
}, mainRouter);
app.use('/private', (req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    req.flash('error', 'login is required');
    res.redirect('/auth/login');
  }
}, privateRouter);


// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
