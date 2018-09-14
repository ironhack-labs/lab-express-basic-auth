require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const bcrypt       = require("bcryptjs");
const bcryptSalt   = 10;
const session      = require("express-session");
const MongoStore   = require("connect-mongo")(session);
const flash        = require('connect-flash');
const passport     = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User         = require('./models/user')


mongoose.Promise = Promise;
mongoose
  .connect('mongodb://localhost/lab-express-basic-auth', {useNewUrlParser: true})
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
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';


app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      


app.use(session({
  secret: "our-passport-local-strategy-app",
  resave: true,
  saveUninitialized: true
}));


app.use(passport.initialize());
app.use(passport.session());



passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

app.use(flash());

passport.use(new LocalStrategy((theUsername, thePassword, next) => {
  console.log('=---=-=-==-=-=-=', theUsername, thePassword)
  User.findOne({ username: theUsername }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(null, false, { message: "Incorrect username" });
    }
    if (!bcrypt.compareSync(thePassword, user.password)) {
      return next(null, false, { message: "Incorrect password" });
    }
    
    return next(null, user);
  });
}));





const index = require('./routes/index');
app.use('/', index);

const authRoutes = require('./routes/auth-routes');
app.use('/', authRoutes)

// const siteRoutes = require('./routes/site-routes');
// app.use('/', siteRoutes)
module.exports = app;
