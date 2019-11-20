require('dotenv').config();

const bodyParser   = require('body-parser');
const express      = require('express');
const path         = require('path');
const cookieParser = require('cookie-parser');
const logger       = require('morgan');
const mongoose     = require('mongoose');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const router       = require('./routes/index');
var mainRouter     = require('./routes/main');
var privateRouter  = require('./routes/private');

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

mongoose
  .connect('mongodb://localhost/starter-code', {useNewUrlParser: true, useUnifiedTopology: true })
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });


const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);
const app = express();


// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


// Express View engine setup
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.set('view engine', 'hbs');
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));


app.use(
  session({
    secret: process.env.SESSION_SECRET,
    // cookie: { maxAge: 3600000 } // 1 hour
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 60 * 60 * 24 * 7, // Default - 14 days
    }),
  }),
);



// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

// Routes
app.use('/', router);
app.use('/', mainRouter);
app.use('/', privateRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;